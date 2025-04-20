namespace FlightBoard.SignalR
{
    using FlightBoard.DB;
    using FlightBoard.Models;
    using Microsoft.AspNetCore.SignalR;
    using Microsoft.Extensions.Logging;
    using System.Threading.Tasks;

    public class FlightsHub : Hub
    {
        private readonly FlightsDbContext _dbContext;
        private readonly ILogger<FlightsHub> _logger;

        public FlightsHub(FlightsDbContext context, ILogger<FlightsHub> logger)
        {
            _dbContext = context;
            _logger = logger;
        }

        public override async Task OnConnectedAsync()
        {
            try
            {
                _logger.LogInformation("Client connected: {ConnectionId}", Context.ConnectionId);
                //var flights = _dbContext.Flights.Where(f => !f.IsDeleted).ToList();
                //await Clients.Caller.SendAsync("ReceiveFlights", flights);
                //_logger.LogInformation($"Flights sent to Client. ConnectionId: [{Context.ConnectionId}] Count: [{flights.Count}] ");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending flights to connected client");
            }

            await base.OnConnectedAsync();
        }



        public async Task NotifyFlightAdded(Flight newFlight)
        {
            await Clients.All.SendAsync("FlightAdded", newFlight);
        }

        public async Task NotifyFlightDeleted(int flightId)
        {
            await Clients.All.SendAsync("FlightDeleted", flightId);
        }





















        public async Task AddFlight(Flight newFlight)
        {
            try
            {
                if (newFlight == null)
                {
                    _logger.LogWarning("Received null flight data from client.");
                    return;
                }

                _dbContext.Flights.Add(newFlight);
                await _dbContext.SaveChangesAsync();

                _logger.LogInformation("New flight added: {Id}", newFlight.Id);


                if (Clients != null && Clients.All != null)
                {
                    await Clients.All.SendAsync("FlightAdded", newFlight);
                }
                //await Clients.All.SendAsync("FlightAdded", newFlight);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding new flight from client");
            }
        }

        public async Task DeleteFlight(int flightId)
        {
            try
            {
                var flight = _dbContext.Flights.FirstOrDefault(f => f.Id == flightId);
                if (flight == null)
                {
                    _logger.LogWarning("Flight update failed: Flight ID {Id} not found", flightId);
                    return;
                }

                flight.IsDeleted = true;

                _dbContext.Flights.Update(flight);
                await _dbContext.SaveChangesAsync();

                _logger.LogInformation("Flight updated by client: {Id}", flight.Id);

                // Notify all connected clients
                await Clients.All.SendAsync("FlightUpdated", flight);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating flight from client");
            }
        }
    }
}
