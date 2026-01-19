using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Logging;
using MyWebApi.DTOs;
using System.Security.Claims;

public class LoggingActionFilter : IActionFilter
{
    private string GetUsername(ActionContext context)
    {
        var user = context.HttpContext.User;
        if (user?.Identity != null && user.Identity.IsAuthenticated)
        {
            return user.FindFirst("username")?.Value ?? "UnknownUser";
        }
        return "Anonymous";
    }

    public void OnActionExecuting(ActionExecutingContext context)
    {
        var actionName = context.ActionDescriptor.RouteValues["action"];
        var controllerName = context.ActionDescriptor.RouteValues["controller"];

        if (actionName == "Me" || actionName == "GetVehicles") // Skip logging for Me
        {
            return;
        }

        var username = GetUsername(context);


        if (actionName == "Login")
        {
            var loginLogger = context.HttpContext.RequestServices.GetService<ILogger<LoggingActionFilter>>();

            if (context.ActionArguments.TryGetValue("loginDTO", out var dtoObj) && dtoObj is LoginDTO loginDto)
            {
                loginLogger?.LogInformation(
                    "User with the email address {Email} is executing {Controller}/{Action}",
                    loginDto.email,
                    controllerName,
                    actionName
                );
            }
            else
            {
                loginLogger?.LogInformation(
                    "Login executing without valid LoginDTO in arguments"
                );
            }
        }

        
        else
        {
            var logger = context.HttpContext.RequestServices.GetService<ILogger<LoggingActionFilter>>();
            logger?.LogInformation(
                "User {username} Executing {Controller}/{Action} with arguments {@Args}",
                username,
                controllerName,
                actionName,
                context.ActionArguments
            );
        }
    }

    public void OnActionExecuted(ActionExecutedContext context)
        {
            var actionName = context.ActionDescriptor.RouteValues["action"];
            var controllerName = context.ActionDescriptor.RouteValues["controller"];

            if (actionName == "Me" || actionName == "GetVehicles") // Skip logging for Me
            {
                return;
            }

            var username = GetUsername(context);

            var logger = context.HttpContext.RequestServices.GetService<ILogger<LoggingActionFilter>>();

            if (actionName == "Login")
            {
            return;
            }
            else
            {
                logger?.LogInformation(
                    "User {username} executed {Controller}/{Action}",
                    username,
                    controllerName,
                    actionName
                );
            }
        }

}
