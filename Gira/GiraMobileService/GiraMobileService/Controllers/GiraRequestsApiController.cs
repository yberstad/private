using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using GiraMobileService.DataObjects;
using GiraMobileService.DataObjects.Models;
using GiraMobileService.Models;

namespace GiraMobileService.Controllers
{
    public class GiraRequestsApiController : ApiController
    {
        private MobileServiceContext db = new MobileServiceContext();

        // GET: api/GiraRequestsApi
        public IQueryable<GiraRequestModel> GetGiraRequests()
        {
            db.Database.Log = Log;
            var giraRequestList = from g in db.GiraRequests.Include(g => g.Type)
                                  select new GiraRequestModel()
                                  {
                                      AllDay = g.AllDay,
                                      Description = g.Description,
                                      Id = g.Id,
                                      GiraTypeName = g.Type.Name,
                                      Date = g.Date,
                                      StartTime = g.StartTime,
                                      StopTime = g.StopTime,
                                      CreatedBy = g.CreatedBy,
                                      Location = g.Location
                                  };
            return giraRequestList;
        }

        private void Log(string log)
        {
            System.Diagnostics.Debug.WriteLine(log);
        }

        // GET: api/GiraRequestsApi/5
        [ResponseType(typeof(GiraRequest))]
        public async Task<IHttpActionResult> GetGiraRequest(string id)
        {
            GiraRequest giraRequest = await db.GiraRequests.FindAsync(id);
            if (giraRequest == null)
            {
                return NotFound();
            }

            return Ok(giraRequest);
        }

        // PUT: api/GiraRequestsApi/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutGiraRequest(string id, GiraRequest giraRequest)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != giraRequest.Id)
            {
                return BadRequest();
            }

            db.Entry(giraRequest).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!GiraRequestExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/GiraRequestsApi
        [ResponseType(typeof(GiraRequest))]
        public async Task<IHttpActionResult> PostGiraRequest(GiraRequest giraRequest)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.GiraRequests.Add(giraRequest);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (GiraRequestExists(giraRequest.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtRoute("DefaultApi", new { id = giraRequest.Id }, giraRequest);
        }

        // DELETE: api/GiraRequestsApi/5
        [ResponseType(typeof(GiraRequest))]
        public async Task<IHttpActionResult> DeleteGiraRequest(string id)
        {
            GiraRequest giraRequest = await db.GiraRequests.FindAsync(id);
            if (giraRequest == null)
            {
                return NotFound();
            }

            db.GiraRequests.Remove(giraRequest);
            await db.SaveChangesAsync();

            return Ok(giraRequest);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool GiraRequestExists(string id)
        {
            return db.GiraRequests.Count(e => e.Id == id) > 0;
        }
    }
}