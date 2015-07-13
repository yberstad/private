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
    public class GiraSubscriptionController : TableController<GiraSubscription>
    {
        protected override void Initialize(HttpControllerContext controllerContext)
        {
            base.Initialize(controllerContext);
            MobileServiceContext context = new MobileServiceContext();
            DomainManager = new EntityDomainManager<GiraSubscription>(context, Request, Services);
        }

        // GET tables/GiraSubscription
        public IQueryable<GiraSubscription> GetAllGiraSubscription()
        {
            return Query(); 
        }

        // GET tables/GiraSubscription/48D68C86-6EA6-4C25-AA33-223FC9A27959
        public SingleResult<GiraSubscription> GetGiraSubscription(string id)
        {
            return Lookup(id);
        }

        // PATCH tables/GiraSubscription/48D68C86-6EA6-4C25-AA33-223FC9A27959
        public Task<GiraSubscription> PatchGiraSubscription(string id, Delta<GiraSubscription> patch)
        {
             return UpdateAsync(id, patch);
        }

        // POST tables/GiraSubscription
        public async Task<IHttpActionResult> PostGiraSubscription(GiraSubscription item)
        {
            GiraSubscription current = await InsertAsync(item);
            return CreatedAtRoute("Tables", new { id = current.Id }, current);
        }

        // DELETE tables/GiraSubscription/48D68C86-6EA6-4C25-AA33-223FC9A27959
        public Task DeleteGiraSubscription(string id)
        {
             return DeleteAsync(id);
        }

    }
}