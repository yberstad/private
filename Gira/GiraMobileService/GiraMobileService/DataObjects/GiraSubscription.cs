using System;
using Microsoft.WindowsAzure.Mobile.Service;

namespace GiraMobileService.DataObjects
{
    public class GiraSubscription : EntityData
    {
        public int GiraSubscriptionId { get; set; }
        public string Location { get; set; }
        public int Type { get; set; }
        public int DayOfWeek { get; set; }
        public DateTime Time { get; set; }
        public string CreatedBy { get; set; }
    }
}