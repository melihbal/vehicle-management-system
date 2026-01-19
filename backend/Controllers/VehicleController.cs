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
using Microsoft.AspNetCore.Authorization;
using System.Linq;
using System.Security.Claims;
using Serilog;



namespace PostgresAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VehicleController : ControllerBase
    {
        private readonly AppDbContext _context;

        public VehicleController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("GetVehicles")]
        public async Task<IActionResult> GetVehicles()
        {
            var vehicles = await _context.vehicles.ToListAsync();
            return Ok(vehicles);
        }
        [HttpPost("CreateVehicle")]
        public async Task<IActionResult> CreateVehicle([FromBody] Vehicle vehicle)
        {
            _context.vehicles.Add(vehicle);
            await _context.SaveChangesAsync();
            return Ok(vehicle);
        }


        [HttpGet("GetSpesific")]
        public async Task<IActionResult> GetSpesific(int vehicleId)
        {
            var result = await _context.vehicles.Where(x => x.aracId == vehicleId).ToListAsync();
            return Ok(result);
        }


        // [Authorize(Roles = "admin")]
        // [HttpPut("EditEntry")]
        // public async Task<IActionResult> EditEntry([FromBody] Vehicle vehicle)
        // {

        //     // DEBUG: see if user is authenticated & claims
        //     var isAuth = User?.Identity?.IsAuthenticated ?? false;
        //     var roleClaim = User?.FindFirst(ClaimTypes.Role)?.Value;
        //     Console.WriteLine($"IsAuthenticated={isAuth}, Role={roleClaim}");
        //     foreach (var c in User.Claims) Console.WriteLine($"{c.Type} = {c.Value}");

        //     var rows = await _context.vehicles.Where(x => x.aracId == vehicle.aracId && x.veriTarihi == vehicle.veriTarihi)
        //         .ExecuteUpdateAsync(setters => setters
        //             .SetProperty(x => x.aracPlaka, vehicle.aracPlaka)
        //             .SetProperty(x => x.hiz, vehicle.hiz)
        //             .SetProperty(x => x.kmSayaci, vehicle.kmSayaci)
        //         );
        //     return Ok(vehicle);
        // }

        [Authorize(Roles = "admin")]
        [HttpPut("EditEntry")]
        public async Task<IActionResult> EditEntry([FromBody] Vehicle vehicle)
        {
            var isAuth = User?.Identity?.IsAuthenticated ?? false;
            var roleClaim = User?.FindFirst(ClaimTypes.Role)?.Value;
            Console.WriteLine($"IsAuthenticated={isAuth}, Role={roleClaim}");
            foreach (var c in User.Claims) Console.WriteLine($"{c.Type} = {c.Value}");

            var existing = await _context.vehicles
                .FirstOrDefaultAsync(x => x.aracId == vehicle.aracId && x.veriTarihi == vehicle.veriTarihi);

            if (existing == null)
                return NotFound();

            existing.aracPlaka = vehicle.aracPlaka;
            existing.hiz = vehicle.hiz;
            existing.kmSayaci = vehicle.kmSayaci;

            await _context.SaveChangesAsync();

            return Ok(existing);
        }


        // Accepts starting and ending date and optionally id's of the vehicles to be displayed
        // Creates a report that shows the kilometers driven between those dates
        [HttpGet("CreateReport")]
        public async Task<IActionResult> CreateReport(DateOnly startingDate, DateOnly endingDate, [FromQuery] int[] ids)
        {
        
            
            List<Dictionary<int, Vehicle>> list = await FindNextAvailableStartingEnding(startingDate, endingDate, ids); 

            if (list.Count < 2)
                return BadRequest("Could not determine both starting and ending vehicles."); 

            Dictionary<int, Vehicle> startingVehicleDict = list[0];
            Dictionary<int, Vehicle> endingVehicleDict = list[1];   

            var reportList = new List<Row>();

            foreach (var pair in startingVehicleDict)
            {
                int aracId = pair.Key;
                Vehicle startVehicle = pair.Value; 

                if (!endingVehicleDict.TryGetValue(aracId, out Vehicle endVehicle))
                    continue;

                Row row = new Row
                {
                    aracPlaka = startVehicle.aracPlaka,
                    startingKm = startVehicle.kmSayaci,
                    endingKm = endVehicle.kmSayaci,
                    kms = endVehicle.kmSayaci - startVehicle.kmSayaci,
                    firstDataDate = startVehicle.veriTarihi,
                    lastDataDate = endVehicle.veriTarihi,
                };

                reportList.Add(row);
            }

            return Ok(reportList); 
        }

        public class Row
        {
            [JsonPropertyName("firstDataDate")]
            public DateOnly firstDataDate { get; set; }

            [JsonPropertyName("lastDataDate")]
            public DateOnly lastDataDate { get; set; }

            [JsonPropertyName("licensePlate")]
            public string aracPlaka { get; set; }

            [JsonPropertyName("startingKm")]
            public float startingKm { get; set; }

            [JsonPropertyName("endingKm")]
            public float endingKm { get; set; }

            [JsonPropertyName("kmsTraveled")]
            public float kms { get; set; }
        }

        [Authorize]
        [HttpDelete("DeleteEntry")]
        public async Task<IActionResult> DeleteEntry(int aracId, DateOnly date)
        {
            var result = await _context.vehicles.FirstOrDefaultAsync(x => x.veriTarihi == date && x.aracId == aracId);

            if (result == null)
            {
                return NotFound($"Entry with aracId={aracId} and date={date} not found.");
            }

            _context.vehicles.Remove(result);
            await _context.SaveChangesAsync();

            return Ok(result);
        }

        [HttpGet("test-log")]
        public IActionResult TestLog()
        {
            Log.Information("User {User} hit the test endpoint at {Time}", "demoUser", DateTime.UtcNow);
            return Ok("Log sent to Graylog");
        }



        [NonAction]
        public async Task<List<Dictionary<int, Vehicle>>> FindNextAvailableStartingEnding(DateOnly startingDate, DateOnly endingDate, int[] ids)
        {
            List<Vehicle> vehiclesInRange;

            if (ids.Length == 0)
            {
                vehiclesInRange = await _context.vehicles
                    .Where(v => v.veriTarihi >= startingDate && v.veriTarihi <= endingDate)
                    .ToListAsync();
            }
            else
            {
                vehiclesInRange = await _context.vehicles
                    .Where(v => v.veriTarihi >= startingDate && v.veriTarihi <= endingDate && ids.Contains(v.aracId))
                    .ToListAsync();
            }

            var startingVehicles = new Dictionary<int, Vehicle>();
            var endingVehicles = new Dictionary<int, Vehicle>();

            foreach (var vehicle in vehiclesInRange)
            {
                int id = vehicle.aracId;
                DateOnly date = vehicle.veriTarihi;

                if (!startingVehicles.ContainsKey(id) || date < startingVehicles[id].veriTarihi)
                {
                    startingVehicles[id] = vehicle;
                }

                if (!endingVehicles.ContainsKey(id) || date > endingVehicles[id].veriTarihi)
                {
                    endingVehicles[id] = vehicle;
                }
            }

            return new List<Dictionary<int, Vehicle>> { startingVehicles, endingVehicles };
        }



    }
}