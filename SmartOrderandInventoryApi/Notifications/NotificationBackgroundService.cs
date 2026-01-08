using Microsoft.Extensions.Hosting;
using SmartOrderandInventoryApi.Data;
using SmartOrderandInventoryApi.Models;
using SmartOrderandInventoryApi.Notifications;

public class NotificationBackgroundService : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;

    public NotificationBackgroundService(IServiceScopeFactory scopeFactory)
    {
        _scopeFactory = scopeFactory;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        await foreach (
            var evt in NotificationQueue.Channel.Reader.ReadAllAsync(stoppingToken))
        {
            using var scope = _scopeFactory.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

            db.Notifications.Add(new Notification
            {
                Message = evt.Message,
                Title = evt.Title,
                UserRole = evt.UserRole,
                TargetUserId = evt.TargetUserId,
                IsRead =false
            });

            await db.SaveChangesAsync();
        }
    }
}
