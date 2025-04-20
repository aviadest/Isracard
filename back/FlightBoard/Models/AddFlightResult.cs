using System.ComponentModel;

namespace FlightBoard.Models
{
    public enum AddFlightResult
    {
        [Description("Flight Created Successfully.")]
        Success,
        [Description("Flight already exists.")]
        Duplicate,
        [Description("General Error.")]
        ServerError,
    }
}
