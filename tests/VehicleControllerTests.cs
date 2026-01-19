using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using PostgresAPI.Controllers;
using MyWebApi.DTOs;
using PostgresAPI.Models;
using PostgresAPI.Data;
using Xunit;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;



namespace PostgresAPI.Tests;

public class VehicleControllerTests
{

    private AppDbContext GetInMemoryAppDbContext(string dbName)
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(dbName)
            .Options;
        return new AppDbContext(options);
    }

    [Fact]
    public async Task VehicleController_GetVehicles_ReturnsAllVehicles()
    {
        var context = GetInMemoryAppDbContext(Guid.NewGuid().ToString());

        context.vehicles.Add(new Vehicle
        {
            aracId = 1,
            aracPlaka = "34ABC123",
            kmSayaci = 100
        });

        context.vehicles.Add(new Vehicle
        {
            aracId = 2,
            aracPlaka = "41ED657",
            kmSayaci = 110
        });

        await context.SaveChangesAsync();

        var controller = new VehicleController(context);
        var result = await controller.GetVehicles() as OkObjectResult;

        Assert.NotNull(result);
        var vehicles = Assert.IsType<List<Vehicle>>(result.Value);
        Assert.Equal(2, vehicles.Count);

    }

    [Fact]
    public async Task VehicleController_CreateVehicle_ReturnsVehicle()
    {
        var context = GetInMemoryAppDbContext(Guid.NewGuid().ToString());
        var controller = new VehicleController(context);
        var vehicle = new Vehicle
        {
            aracId = 1,
            aracPlaka = "24MLH000",
            veriTarihi = DateOnly.FromDateTime(DateTime.Now),
            hiz = 100,
            kmSayaci = 10000
        };

        //act
        var result = await controller.CreateVehicle(vehicle);

        //assert
        var okResult = Assert.IsType<Microsoft.AspNetCore.Mvc.OkObjectResult>(result);
        var returnedVehicle = Assert.IsType<Vehicle>(okResult.Value);
        Assert.Equal(returnedVehicle.aracPlaka, vehicle.aracPlaka);
        Assert.Equal(context.vehicles.Last().aracPlaka, "24MLH000");
    }

    [Fact]
    public async Task VehicleController_GetSpesific_ReturnsVehicle()
    {
        var context = GetInMemoryAppDbContext(Guid.NewGuid().ToString());

        context.vehicles.Add(new Vehicle
        {
            aracId = 2,
            aracPlaka = "34ABC123",
            kmSayaci = 100
        });

        await context.SaveChangesAsync();
        var controller = new VehicleController(context);

        //act
        var spesificVehicle = await controller.GetSpesific(2);


        //assert
        var okResult = Assert.IsType<OkObjectResult>(spesificVehicle);
        var vehicles = Assert.IsType<System.Collections.Generic.List<Vehicle>>(okResult.Value);
        Assert.Single(vehicles);
        Assert.Equal(vehicles.Last().aracId, 2);
    }


    [Fact]
    public async Task VehicleController_EditEntry_ReturnsEditedVehicle()
    {
        //arrange
        var dbName = nameof(VehicleController_EditEntry_ReturnsEditedVehicle);
        var context = GetInMemoryAppDbContext(dbName);

        var existingVehicle = new Vehicle
        {
            aracId = 1,
            aracPlaka = "34MLH000",
            veriTarihi = new DateOnly(2000, 01, 01),
            hiz = 100,
            kmSayaci = 80000
        };

        var updatedVehicle = new Vehicle
        {
            aracId = 1,
            aracPlaka = "34MLH000",
            veriTarihi = new DateOnly(2000, 01, 01),
            hiz = 10,
            kmSayaci = 1000
        };

        context.Add(existingVehicle);
        await context.SaveChangesAsync();

        var controller = GetControllerWithAdmin(context);

        //act
        var result = await controller.EditEntry(updatedVehicle);


        //arrange
        var okResult = Assert.IsType<OkObjectResult>(result);
        var returnedVehicle = Assert.IsType<Vehicle>(okResult.Value);

        Assert.Equal(returnedVehicle.aracId, 1);
        Assert.Equal(returnedVehicle.aracPlaka, "34MLH000");
        Assert.Equal(returnedVehicle.kmSayaci, 1000);
        Assert.Equal(returnedVehicle.hiz, 10);

        var vehicleInDb = context.vehicles.FirstAsync(i => i.aracId == 2);

        Assert.Equal(context.vehicles.Last().aracPlaka, "34MLH000");
        Assert.Equal(context.vehicles.Last().hiz, 10);
        Assert.Equal(context.vehicles.Last().kmSayaci, 1000);
    }

    private VehicleController GetControllerWithAdmin(AppDbContext context)
    {
        var controller = new VehicleController(context);

        // Fake identity with "admin" role
        var user = new ClaimsPrincipal(new ClaimsIdentity(new[]
        {
            new Claim(ClaimTypes.Name, "TestUser"),
            new Claim(ClaimTypes.Role, "admin")
        }, "mock"));

        controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext { User = user }
        };
        return controller;
    }

    [Fact]
    public async Task VehicleController_CreateReport_ReturnsListOfRows()
    {
        // create a fake database
        var dbName = nameof(VehicleController_CreateReport_ReturnsListOfRows).ToString();
        var context = GetInMemoryAppDbContext(dbName);

        context.vehicles.AddRange(
            new Vehicle { aracId = 1, aracPlaka = "ABC123", kmSayaci = 700, veriTarihi = new DateOnly(2025, 7, 12) },
            new Vehicle { aracId = 1, aracPlaka = "ABC123", kmSayaci = 1000, veriTarihi = new DateOnly(2025, 8, 1) },
            new Vehicle { aracId = 1, aracPlaka = "ABC123", kmSayaci = 1200, veriTarihi = new DateOnly(2025, 8, 5) },
            new Vehicle { aracId = 2, aracPlaka = "XYZ789", kmSayaci = 500, veriTarihi = new DateOnly(2025, 8, 1) },
            new Vehicle { aracId = 2, aracPlaka = "XYZ789", kmSayaci = 700, veriTarihi = new DateOnly(2025, 8, 5) },
            new Vehicle { aracId = 2, aracPlaka = "XYZ789", kmSayaci = 1200, veriTarihi = new DateOnly(2025, 8, 7) }
        );
        await context.SaveChangesAsync();

        var controller = new VehicleController(context);
        var startingDate = new DateOnly(2025, 8, 1);
        var endingDate = new DateOnly(2025, 8, 5);
        int[] ids = new int[] { 1, 2 };


        //act
        var result = await controller.CreateReport(startingDate, endingDate, ids);

        //assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var resultList = Assert.IsType<List<VehicleController.Row>>(okResult.Value);

        Assert.Equal(2, resultList.Count);
        Assert.Equal(200, resultList.First(i => i.aracPlaka == "ABC123").kms);
        Assert.Equal(200, resultList.First(i => i.aracPlaka == "XYZ789").kms);
    }



}
