using System;

namespace GiraMobileService.DataObjects.Models
{
    public class GiraRequestModel
    {
        public string Id { get; set; }
        public DateTime Date { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime StopTime { get; set; }
        public string Location { get; set; }
        public bool AllDay { get; set; }
        public string CreatedBy { get; set; }
        public string Description { get; set; }
        public string GiraTypeName { get; set; }
        public string CreatedByUserName { get; set; }
        public string CreatedByUserId { get; set; }
    }
}