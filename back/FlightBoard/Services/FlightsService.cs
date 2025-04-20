using FlightBoard.DB;
using FlightBoard.Models;
using FlightBoard.SignalR;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace FlightBoard.Services
{
    public class FlightsService
    {
        private readonly FlightsDbContext _dbContext;
        private readonly IHubContext<FlightsHub> _hubContext;
        private readonly ILogger<FlightsService> _logger;

        public FlightsService(FlightsDbContext dbContext, IHubContext<FlightsHub> hubContext, ILogger<FlightsService> logger)
        {
            _dbContext = dbContext;
            _hubContext = hubContext;
            _logger = logger;
        }

        //public async Task<List<Flight>> GetFlights(string? status, string? destination)
        //{
        //    var query = _dbContext.Flights.Where(f => !f.IsDeleted); // Exclude deleted flights

        //    if (!string.IsNullOrEmpty(status))
        //        query = query.Where(f => f.Status.Equals(status, StringComparison.OrdinalIgnoreCase));

        //    if (!string.IsNullOrEmpty(destination))
        //        query = query.Where(f => f.Destination.Equals(destination, StringComparison.OrdinalIgnoreCase));

        //    return await query.ToListAsync();
        //}


        public async Task<List<Flight>> GetFlights(string? status, string? destination)
        {
            var query = _dbContext.Flights.Where(f => !f.IsDeleted);

            query = Utils.Utils.CreateQuery(query, status, destination);

            return await query.ToListAsync();
        }




        public async Task<AddFlightResult> AddFlight(Flight newFlight)
        {
            AddFlightResult result;

            try
            {
                if (_dbContext.Flights.Any(f => f.FlightNumber == newFlight.FlightNumber && f.IsDeleted == false))
                {
                    return AddFlightResult.Duplicate;
                }

                _dbContext.Flights.Add(newFlight);
                await _dbContext.SaveChangesAsync();
                _logger.LogInformation("Flight added: {Id}", newFlight.Id);

                await _hubContext.Clients.All.SendAsync("FlightAdded", newFlight);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding flight");
                return AddFlightResult.ServerError;
            }

            return AddFlightResult.Success;

        }

        public async Task<bool> DeleteFlight(int flightId)
        {
            try
            {
                var flight = _dbContext.Flights.FirstOrDefault(f => f.Id == flightId);
                if (flight == null)
                {
                    _logger.LogWarning("Flight deletion failed: ID {Id} not found", flightId);
                    return false;
                }

                flight.IsDeleted = true;
                _dbContext.Flights.Update(flight);
                await _dbContext.SaveChangesAsync();
                _logger.LogInformation("Flight deleted: {Id}", flightId);

                await _hubContext.Clients.All.SendAsync("FlightDeleted", flightId);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting flight");
                return false;
            }
        }
    }
}
