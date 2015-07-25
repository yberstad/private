using System;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.WindowsAzure.Mobile.Service;

namespace GiraMobileService.DataObjects
{
    public class GiraSubscription : EntityData
    {
        public string Location { get; set; }
        public int DayOfWeek { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime StopTime { get; set; }
        public bool AllDay { get; set; }
        public string Description { get; set; }
        public string CreatedBy { get; set; }
        public bool Enabled { get; set; }

        public string GiraTypeRefId { get; set; }
        [ForeignKey("GiraTypeRefId")]
        public GiraType Type { get; set; }
    }
}