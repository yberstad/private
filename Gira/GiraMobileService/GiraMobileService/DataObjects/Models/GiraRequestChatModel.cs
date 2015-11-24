using System;

namespace GiraMobileService.DataObjects.Models
{
    public class GiraRequestChatModel
    {
        public string Id { get; set; }
        public DateTimeOffset? Date { get; set; }
        public string CreatedBy { get; set; }
        public string Message { get; set; }
        public string CreatedByUserName { get; set; }
        public string CreatedByUserId { get; set; }
    }
}