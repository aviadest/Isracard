using FlightBoard.DB;
using FlightBoard.Services;
using FlightBoard.SignalR;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

// Add services
builder.Services.AddDbContext<FlightsDbContext>();
builder.Services.AddScoped<FlightsService>();
builder.Services.AddSignalR();
builder.Services.AddLogging();


var app = builder.Build();
app.UseCors(options =>
   options.WithOrigins("http://localhost:5173")
   .AllowAnyMethod()
   .AllowAnyHeader()
   .AllowCredentials());

app.UseAuthorization();

app.MapControllers();
app.UsePathBase("/api");
app.MapHub<FlightsHub>("/connect");

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<FlightsDbContext>();
    //dbContext.Database.Migrate();
    dbContext.Database.EnsureCreated();
}

app.Run();
