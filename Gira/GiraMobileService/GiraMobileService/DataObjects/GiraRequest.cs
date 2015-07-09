using System;
using Microsoft.WindowsAzure.Mobile.Service;

namespace GiraMobileService.DataObjects
{
    public class GiraRequest : EntityData
    {
        public string Location { get; set; }
        public string GiraTypeId { get; set; }
        public DateTime Date { get; set; }
        public string CreatedBy { get; set; }
        public bool Enabled { get; set; }
    }
}