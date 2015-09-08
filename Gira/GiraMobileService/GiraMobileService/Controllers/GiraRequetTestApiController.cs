using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace GiraMobileService.Controllers
{
    public class GiraRequetTestApiController : ApiController
    {
        // GET: api/GiraRequetTestApi
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET: api/GiraRequetTestApi/5
        public string Get(int id)
        {
            return "value";
        }

        // POST: api/GiraRequetTestApi
        public void Post([FromBody]string value)
        {
        }

        // PUT: api/GiraRequetTestApi/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/GiraRequetTestApi/5
        public void Delete(int id)
        {
        }
    }
}
