using System;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.WindowsAzure.Mobile.Service;
using GiraMobileService.AppCode.Attributes;
using Newtonsoft.Json;

namespace GiraMobileService.DataObjects
{
    public class GiraRequest : EntityData
    {
        public string Location { get; set; }

        [JsonConverter(typeof(JsonDateFormatter))]
        public DateTime Date { get; set; }

        [JsonConverter(typeof(JsonDateFormatter))]
        public DateTime StartTime { get; set; }

        [JsonConverter(typeof(JsonDateFormatter))]
        public DateTime StopTime { get; set; }

        public bool AllDay { get; set; }
        public string CreatedBy { get; set; }
        public bool Enabled { get; set; }
        public string Description { get; set; }
        public bool UsePrivateConversation { get; set; }

        public string GiraTypeRefId { get; set; }
        [ForeignKey("GiraTypeRefId")]
        public GiraType Type { get; set; }
    }
}