using FlightBoard.Models;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Reflection;

namespace FlightBoard.Utils
{
    public static class Utils
    {
        public class FutureDateAttribute : ValidationAttribute
        {
            protected override ValidationResult? IsValid(object value, ValidationContext validationContext)
            {
                if (value is DateTime dateTime)
                {
                    return dateTime > DateTime.Now ? ValidationResult.Success : new ValidationResult("Departure time must be in the future.");
                }
                return new ValidationResult("Invalid date format.");
            }
        }

        public static string GetDescription(Enum value) =>
            value.GetType().GetField(value.ToString())?.GetCustomAttribute<DescriptionAttribute>()?.Description ?? value.ToString();

        public static IQueryable<Flight> CreateQuery(IQueryable<Flight> query, string? status, string? destination)
        {
            if (!string.IsNullOrEmpty(destination))
            {
                var lower = destination.ToLower();
                query = query.Where(f => f.Destination.ToLower().Contains(lower));
            }

            if (!string.IsNullOrEmpty(status))
            {
                DateTime now = DateTime.Now;

                switch (status)
                {
                    case "Scheduled":
                        query = query.Where(f => f.DepartureTime > now.AddMinutes(30));
                        break;

                    case "Boarding":
                        query = query.Where(f => f.DepartureTime > now.AddMinutes(10) &&
                                                 f.DepartureTime <= now.AddMinutes(30));
                        break;

                    case "Departed":
                        query = query.Where(f => f.DepartureTime >= now.AddMinutes(-60) &&
                                                 f.DepartureTime <= now.AddMinutes(10));
                        break;

                    case "Delayed":
                        query = query.Where(f => f.DepartureTime < now.AddMinutes(-15) &&
                                                 f.DepartureTime > now.AddMinutes(-60));
                        break;

                    case "Landed":
                        query = query.Where(f => f.DepartureTime < now.AddMinutes(-60));
                        break;
                }
            }


            return query;
        }
    }
}
