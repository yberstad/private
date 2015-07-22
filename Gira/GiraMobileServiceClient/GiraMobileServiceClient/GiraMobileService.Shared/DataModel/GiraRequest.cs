using System;
using Newtonsoft.Json;

namespace GiraMobileService.DataModel
{
    public class GiraRequest
    {
        public string Id { get; set; }

        [JsonProperty(PropertyName = "location")]
        public string Location { get; set; }

        [JsonProperty(PropertyName = "date")]
        public DateTime Date { get; set; }

        [JsonProperty(PropertyName = "createdBy")]
        public string CreatedBy { get; set; }

        [JsonProperty(PropertyName = "enabled")]
        public bool Enabled { get; set; }

        [JsonProperty(PropertyName = "type")]
        public virtual GiraType Type { get; set; }

    }
}
