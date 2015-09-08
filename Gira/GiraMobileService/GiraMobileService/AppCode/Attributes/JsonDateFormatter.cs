using Newtonsoft.Json.Converters;

namespace GiraMobileService.AppCode.Attributes
{
    class JsonDateFormatter : IsoDateTimeConverter
    {
        public JsonDateFormatter()
        {
            DateTimeFormat = "YYYY-MM-dd hh:mm:ss";
        }
    }
}