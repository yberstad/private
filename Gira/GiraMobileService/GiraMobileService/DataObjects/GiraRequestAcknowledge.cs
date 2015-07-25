using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.WindowsAzure.Mobile.Service;

namespace GiraMobileService.DataObjects
{
    public class GiraRequestAcknowledge : EntityData
    {
		public string Message { get; set; }
		public bool ShowContactInfo { get; set; }
        public string CreatedBy { get; set; }

        public string GiraRequestRefId { get; set; }
        [ForeignKey("GiraRequestRefId")]
        public GiraRequest Request { get; set; }

        public string GiraUserRefId { get; set; }
        [ForeignKey("GiraUserRefId")]
        public GiraUser User { get; set; }
    }
}