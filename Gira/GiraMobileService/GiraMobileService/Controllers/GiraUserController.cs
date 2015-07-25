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
    public class GiraUserController : TableController<GiraUser>
    {
        protected override void Initialize(HttpControllerContext controllerContext)
        {
            base.Initialize(controllerContext);
            MobileServiceContext context = new MobileServiceContext();
            DomainManager = new EntityDomainManager<GiraUser>(context, Request, Services);
        }

        // GET tables/GiraUser
        public IQueryable<GiraUser> GetAllGiraUser()
        {
            return Query(); 
        }

        // GET tables/GiraUser/48D68C86-6EA6-4C25-AA33-223FC9A27959
        public SingleResult<GiraUser> GetGiraUser(string id)
        {
            return Lookup(id);
        }

        // PATCH tables/GiraUser/48D68C86-6EA6-4C25-AA33-223FC9A27959
        public Task<GiraUser> PatchGiraUser(string id, Delta<GiraUser> patch)
        {
             return UpdateAsync(id, patch);
        }

        // POST tables/GiraUser
        public async Task<IHttpActionResult> PostGiraUser(GiraUser item)
        {
            GiraUser current = await InsertAsync(item);
            return CreatedAtRoute("Tables", new { id = current.Id }, current);
        }

        // DELETE tables/GiraUser/48D68C86-6EA6-4C25-AA33-223FC9A27959
        public Task DeleteGiraUser(string id)
        {
             return DeleteAsync(id);
        }

    }
}