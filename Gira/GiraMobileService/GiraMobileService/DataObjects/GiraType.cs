using Microsoft.WindowsAzure.Mobile.Service;

namespace GiraMobileService.DataObjects
{
    public class GiraType : EntityData
    {
        public int GiraTypeId { get; set; }
        public string Name { get; set; }
    }
}