using System;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.WindowsAzure.Mobile.Service;

namespace GiraMobileService.DataObjects
{
    public class GiraRequest : EntityData
    {
        public string Location { get; set; }
        public DateTime Date { get; set; }
        public string CreatedBy { get; set; }
        public bool Enabled { get; set; }

        [ForeignKey("Id")]
        public virtual GiraType Type { get; set; }
    }
}