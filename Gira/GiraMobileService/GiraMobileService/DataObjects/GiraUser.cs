using Microsoft.WindowsAzure.Mobile.Service;

namespace GiraMobileService.DataObjects
{
    public class GiraUser : EntityData
    {
        public string UserId { get; set; }
		public string UserName{ get; set; }
		public string Email{ get; set; }
		public string Phone{ get; set; }
    }
}