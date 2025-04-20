using FlightBoard.Models;
using FlightBoard.Services;
using Microsoft.AspNetCore.Mvc;

namespace FlightBoard.Controllers
{
    [ApiController]
    [Route("flights")]
    public class FlightsController : ControllerBase
    {
        private readonly FlightsService _flightsService;
        private readonly ILogger<FlightsController> _logger;

        public FlightsController(FlightsService flightService, ILogger<FlightsController> logger)
        {
            _flightsService = flightService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> GetFlights([FromQuery] string? status, [FromQuery] string? destination)
        {
            var flights = await _flightsService.GetFlights(status, destination);

            return Ok(flights);
        }

        [HttpPost]
        public async Task<IActionResult> AddFlight([FromBody] Flight flight)
        {
            if (flight == null)
            {
                _logger.LogWarning("Attempted to add null flight");
                return BadRequest("Invalid flight data");
            }
            var result = await _flightsService.AddFlight(flight);


            return result switch
            {
                AddFlightResult.Success =>
                    CreatedAtAction(null, new
                    {
                        message = Utils.Utils.GetDescription(AddFlightResult.Success),
                    }),

                AddFlightResult.Duplicate =>
                    Conflict(new { errors = new { flightNumber = new[] { Utils.Utils.GetDescription(AddFlightResult.Duplicate) } } }),


                AddFlightResult.ServerError =>
                    StatusCode(500, new { errors = new { serverError = new[] { Utils.Utils.GetDescription(AddFlightResult.ServerError) } } }),

            };
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFlight(int id)
        {
            var success = await _flightsService.DeleteFlight(id);
            if (!success) return NotFound("Flight not found");

            return Ok($"Flight {id} deleted");
        }
    }
}
