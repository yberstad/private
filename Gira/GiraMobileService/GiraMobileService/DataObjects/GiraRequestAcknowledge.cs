using System;
using Microsoft.WindowsAzure.Mobile.Service;

namespace GiraMobileService.DataObjects
{
    public class GiraRequestAcknowledge : EntityData
    {
		public int GiraRequestId { get; set; }
		public int GiraUserId { get; set; }
		public string Message { get; set; }
		public bool ShowContactInfo { get; set; }
        public string CreatedBy { get; set; }
    }
}