using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PostgresAPI.Data;
using PostgresAPI.Models;
using System.Text.Json.Serialization;
using DevExtreme.AspNet.Data;
using DevExtreme.AspNet.Data.ResponseModel;
using Microsoft.AspNetCore.Http;
using DevExtreme.AspNet.Data.Helpers;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authorization;
using MyWebApi.DTOs;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Serilog;


namespace PostgresAPI.Controllers
{

    [Route("api/[Controller]")]
    [ApiController]

    public class UserController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration configuration;

        public UserController(AppDbContext dbContext, IConfiguration configuration)
        {
            _context = dbContext;
            this.configuration = configuration;
        }

        [HttpPost]
        [Route("Registration")]
        public IActionResult Registration([FromBody] UserDTO userDTO)
        {
            if (_context.users.Any(u => u.email == userDTO.email))
            {
                return Conflict("Email already in use.");
            }

            var hashedPassword = PasswordHelper.HashPassword(userDTO.password);
            Console.WriteLine(hashedPassword);


            var user = new User
            {
                username = userDTO.username,
                password = hashedPassword,
                email = userDTO.email,
                role = "user"
            };

            _context.users.Add(user);
            _context.SaveChanges();
            return CreatedAtAction(nameof(GetUser), new { id = user.id }, user);
        }

        [HttpPost]
        [Route("Login")]
        public IActionResult Login(LoginDTO loginDTO)
        {

            var user = _context.users.FirstOrDefault(x => x.email == loginDTO.email);
            if (user != null && PasswordHelper.verifyPassword(loginDTO.password, user.password))
            {
                var accessToken = CreateAccessToken(user);

                var refreshToken = GenerateRefreshToken();

                user.refreshToken = refreshToken;
                user.refreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
                _context.SaveChanges();

                // Choose cookie options based on whether the current request is HTTPS
                var isHttps = Request.IsHttps;
                var sameSite = isHttps ? SameSiteMode.None : SameSiteMode.Lax;
                var secure = isHttps; // browsers require Secure=true for SameSite=None

                // Set access token cookie
                var accessCookieOptions = new CookieOptions
                {
                    HttpOnly = true,
                    Secure = secure,
                    SameSite = sameSite,
                    Path = "/",
                    Expires = DateTime.UtcNow.AddMinutes(20)
                };
                Response.Cookies.Append("accessToken", accessToken, accessCookieOptions);

                // Set refresh token cookie
                var refreshCookieOptions = new CookieOptions
                {
                    HttpOnly = true,
                    Secure = secure,
                    SameSite = sameSite,
                    Path = "/",
                    Expires = user.refreshTokenExpiryTime
                };
                Response.Cookies.Append("refreshToken", refreshToken, refreshCookieOptions);

                // Return success (Angular doesn’t need the access token in body if you rely on cookie)
                return Ok(new { message = "Login successful" });
            }

            return BadRequest("Invalid credentials");
        }

        [HttpPost]
        [Route("UpdateRecordHashing")]
        public IActionResult UpdateRecordsHashing([FromQuery] string idsString)
        {
            int[] ids = idsString.Split(" ").Select(int.Parse).ToArray();
            User? user = null;

            var updatedUsers = new List<UserDTO>();

            foreach (int id in ids)
            {
                user = _context.users.FirstOrDefault(u => u.id == id);

                if (user == null) continue;

                DeleteUser(user.username);

                UserDTO userDto = new UserDTO
                {
                    username = user.username,
                    password = user.password,
                    email = user.email
                };

                Registration(userDto);
                updatedUsers.Add(userDto);

                SetRoleAdmin(user.email, user.role);
            }
            return Ok(updatedUsers);
        }




        //[Authorize(Roles = "employee, admin")]
        [HttpGet]
        [Route("GetUsers")]
        public IActionResult GetUsers()
        {
            var users = _context.users.ToList();
            return Ok(users);
        }


        //[Authorize(Roles = "employee, admin")]
        [HttpGet]
        [Route("GetUser")]
        public IActionResult GetUser(string username)
        {
            var user = _context.users.FirstOrDefault(x => x.username == username);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(user);
        }


        [HttpDelete]
        [Route("DeleteUser")]
        public IActionResult DeleteUser(string username)
        {
            var user = _context.users.FirstOrDefault(x => x.username == username);
            if (user == null)
                return NotFound("User not found");

            _context.users.Remove(user);
            _context.SaveChanges();
            return Ok(user);
        }


        [HttpPost]
        [Route("SetRoleAdmin")]
        public IActionResult SetRoleAdmin(string email, string role)
        {
            if (role != "user" && role != "admin" && role != "employee")
                return NotFound("Role not found.");

            var user = _context.users.FirstOrDefault(x => x.email == email);

            if (user == null)
                return NotFound("User not found.");

            user.role = role;
            _context.SaveChanges();

            return Ok("Role updated.");

        }



        [Authorize(Roles = "employee")]
        [HttpPost]
        [Route("SetRoleEmployee")]
        public IActionResult SetRoleEmployee(string email, string role)
        {
            if (role != "user" && role != "admin" && role != "employee")
                return NotFound("Role not found.");

            if (role == "admin")
                return BadRequest("Unauthorizes request");

            var user = _context.users.FirstOrDefault(x => x.email == email);

            if (user == null)
                return NotFound("User not found.");

            user.role = role;
            _context.SaveChanges();

            return Ok("Role updated.");

        }

        private string GenerateRefreshToken()
        {
            var randomBytes = new byte[64];
            using (var rng = System.Security.Cryptography.RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomBytes);
                return Convert.ToBase64String(randomBytes);
            }
        }
        private string CreateAccessToken(User user)
        {
            var claims = new[] {
                new Claim(JwtRegisteredClaimNames.Sub, configuration["Jwt:Subject"]),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim("username", user.username),
                new Claim("email", user.email),
                new Claim(ClaimTypes.Role, user.role)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"]));
            var signIn = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(
                configuration["Jwt:Issuer"],
                configuration["Jwt:Audience"],
                claims,
                expires: DateTime.UtcNow.AddMinutes(20),
                signingCredentials: signIn
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        [HttpPost]
        [Route("RefreshToken")]
        public IActionResult RefreshToken()
        {
            if (!Request.Cookies.TryGetValue("refreshToken", out var refreshToken))
            {
                return Unauthorized("No refresh token provided.");
            }

            var user = _context.users.FirstOrDefault(u => u.refreshToken == refreshToken);
            if (user == null || user.refreshTokenExpiryTime == null || user.refreshTokenExpiryTime < DateTime.UtcNow)
            {
                return Unauthorized("Invalid or expired refresh token.");
            }

            // new refresh token
            var newRefreshToken = GenerateRefreshToken();
            user.refreshToken = newRefreshToken;
            user.refreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
            _context.SaveChanges();

            // new cookie
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Expires = user.refreshTokenExpiryTime,
                Secure = true,
                SameSite = SameSiteMode.None,
                Path = "/"
            };
            Response.Cookies.Append("refreshToken", newRefreshToken, cookieOptions);

            // new access token
            var newAccessToken = CreateAccessToken(user);
            var accessCookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Path = "/",
                Expires = DateTime.UtcNow.AddMinutes(20)
            };
            Response.Cookies.Append("accessToken", newAccessToken, accessCookieOptions);
            return Ok(new { accessToken = newAccessToken });

        }

        [HttpPost]
        [Route("RevokeToken")]
        public IActionResult RevokeToken()
        {
            if (!Request.Cookies.TryGetValue("refreshToken", out var refreshToken))
            {
                return BadRequest("No refresh token provided.");
            }

            var user = _context.users.FirstOrDefault(u => u.refreshToken == refreshToken);
            if (user == null) return NotFound();

            user.refreshToken = null;
            user.refreshTokenExpiryTime = null;
            
            _context.SaveChanges();

            // Remove cookie
            Response.Cookies.Delete("refreshToken", new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Path = "/"
            });

            Response.Cookies.Delete("accessToken", new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Path = "/"
            });

            return Ok("Token revoked.");
        }

        [HttpPost("track")]
        public IActionResult TrackUserAction([FromBody] UserActionDTO action)
        {
            Log.Information("User {UserID} performed {Action} at {TimeStamp}",
            action.UserID, action.Action, action.TimeStamp);

            return Ok();

        }


        [HttpGet]
        [Route("Me")]
        public IActionResult Me()
        {
            var username = User.Claims.FirstOrDefault(c => c.Type == "username")?.Value;
            var email = User.Claims.FirstOrDefault(c => c.Type == "email")?.Value;
            var role = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role)?.Value;

            return Ok(new
            {
                Username = username,
                Email = email,
                Role = role
            });
        }
        

    }

}