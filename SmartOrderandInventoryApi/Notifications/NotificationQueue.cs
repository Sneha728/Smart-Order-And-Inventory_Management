using System.Threading.Channels;

namespace SmartOrderandInventoryApi.Notifications
{
    public static class NotificationQueue
    {
        public static Channel<NotificationEvent> Channel =
            System.Threading.Channels.Channel.CreateUnbounded<NotificationEvent>();
    }
}
