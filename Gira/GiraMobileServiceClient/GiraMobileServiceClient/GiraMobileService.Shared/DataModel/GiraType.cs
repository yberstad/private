using Newtonsoft.Json;

namespace GiraMobileService.DataModel
{
    public class GiraType
    {
        [JsonProperty(PropertyName = "giraTypeId")]
        public int GiraTypeId { get; set; }

        [JsonProperty(PropertyName = "name")]
        public string Name { get; set; }
    }
}
