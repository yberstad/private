using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.WindowsAzure.Mobile.Service;

namespace GiraMobileService.DataObjects
{
    public class GiraRequestAcknowledge : EntityData
    {
		public string Message { get; set; }
		public bool ShowContactInfo { get; set; }
        public string CreatedBy { get; set; }

        [ForeignKey("Id")]
        public virtual GiraRequest Request { get; set; }

        [ForeignKey("Id")]
        public virtual GiraUser User { get; set; }
    }
}