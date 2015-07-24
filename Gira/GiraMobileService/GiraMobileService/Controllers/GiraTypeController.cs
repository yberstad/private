using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Controllers;
using System.Web.Http.OData;
using Microsoft.WindowsAzure.Mobile.Service;
using GiraMobileService.DataObjects;
using GiraMobileService.Models;

namespace GiraMobileService.Controllers
{
    public class GiraTypeController : TableController<GiraType>
    {
        protected override void Initialize(HttpControllerContext controllerContext)
        {
            base.Initialize(controllerContext);
            MobileServiceContext context = new MobileServiceContext();
            DomainManager = new EntityDomainManager<GiraType>(context, Request, Services);
        }

        // GET tables/GiraType
        public IQueryable<GiraType> GetAllGiraType()
        {
            return Query(); 
        }

        // GET tables/GiraType/48D68C86-6EA6-4C25-AA33-223FC9A27959
        public SingleResult<GiraType> GetGiraType(string id)
        {
            return Lookup(id);
        }

        // PATCH tables/GiraType/48D68C86-6EA6-4C25-AA33-223FC9A27959
        public Task<GiraType> PatchGiraType(string id, Delta<GiraType> patch)
        {
             return UpdateAsync(id, patch);
        }

        // POST tables/GiraType
        public async Task<IHttpActionResult> PostGiraType(GiraType item)
        {
            GiraType current = await InsertAsync(item);
            return CreatedAtRoute("Tables", new { id = current.Id }, current);
        }

        // DELETE tables/GiraType/48D68C86-6EA6-4C25-AA33-223FC9A27959
        public Task DeleteGiraType(string id)
        {
             return DeleteAsync(id);
        }

    }
}