using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.ModelBinding;
using System.Web.Http.OData;
using System.Web.Http.OData.Routing;
using GiraMobileService.DataObjects;
using GiraMobileService.DataObjects.Models;
using GiraMobileService.Models;

namespace GiraMobileService.Controllers
{
    /*
    The WebApiConfig class may require additional changes to add a route for this controller. Merge these statements into the Register method of the WebApiConfig class as applicable. Note that OData URLs are case sensitive.

    using System.Web.Http.OData.Builder;
    using System.Web.Http.OData.Extensions;
    using GiraMobileService.DataObjects;
    ODataConventionModelBuilder builder = new ODataConventionModelBuilder();
    builder.EntitySet<GiraRequest>("GiraRequestsOdata");
    builder.EntitySet<GiraType>("GiraTypes"); 
    config.Routes.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    public class GiraRequestsOdataController : ODataController
    {
        private MobileServiceContext db = new MobileServiceContext();

        // GET: odata/GiraRequestsOdata
        [EnableQuery]
        public IQueryable<GiraRequestModel> GetGiraRequestsOdata()
        {
            db.Database.Log = s => System.Diagnostics.Debug.WriteLine(s);
            //GiraRequestModelMapper mapper = new GiraRequestModelMapper();
            //return mapper.Map(db.GiraRequests);
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

        // GET: odata/GiraRequestsOdata(5)
        [EnableQuery]
        public SingleResult<GiraRequest> GetGiraRequest([FromODataUri] string key)
        {
            return SingleResult.Create(db.GiraRequests.Where(giraRequest => giraRequest.Id == key));
        }

        // PUT: odata/GiraRequestsOdata(5)
        public async Task<IHttpActionResult> Put([FromODataUri] string key, Delta<GiraRequest> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            GiraRequest giraRequest = await db.GiraRequests.FindAsync(key);
            if (giraRequest == null)
            {
                return NotFound();
            }

            patch.Put(giraRequest);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!GiraRequestExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(giraRequest);
        }

        // POST: odata/GiraRequestsOdata
        public async Task<IHttpActionResult> Post(GiraRequest giraRequest)
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

            return Created(giraRequest);
        }

        // PATCH: odata/GiraRequestsOdata(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public async Task<IHttpActionResult> Patch([FromODataUri] string key, Delta<GiraRequest> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            GiraRequest giraRequest = await db.GiraRequests.FindAsync(key);
            if (giraRequest == null)
            {
                return NotFound();
            }

            patch.Patch(giraRequest);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!GiraRequestExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(giraRequest);
        }

        // DELETE: odata/GiraRequestsOdata(5)
        public async Task<IHttpActionResult> Delete([FromODataUri] string key)
        {
            GiraRequest giraRequest = await db.GiraRequests.FindAsync(key);
            if (giraRequest == null)
            {
                return NotFound();
            }

            db.GiraRequests.Remove(giraRequest);
            await db.SaveChangesAsync();

            return StatusCode(HttpStatusCode.NoContent);
        }

        // GET: odata/GiraRequestsOdata(5)/Type
        [EnableQuery]
        public SingleResult<GiraType> GetType([FromODataUri] string key)
        {
            return SingleResult.Create(db.GiraRequests.Where(m => m.Id == key).Select(m => m.Type));
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool GiraRequestExists(string key)
        {
            return db.GiraRequests.Count(e => e.Id == key) > 0;
        }
    }
}
