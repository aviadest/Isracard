using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FlightBoard.Models
{
    public class Flight
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Flight Number must be greater than zero.")]
        public int FlightNumber { get; set; }

        [Required]
        public string Destination { get; set; }

        [Required]
        [Utils.Utils.FutureDate]
        public DateTime DepartureTime { get; set; }

        [Required]
        public string Gate { get; set; }

        [Column(TypeName = "bit")]
        public bool IsDeleted { get; set; } = false;
    }
}
