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
    public class GiraRequestAcknowledgeController : TableController<GiraRequestAcknowledge>
    {
        protected override void Initialize(HttpControllerContext controllerContext)
        {
            base.Initialize(controllerContext);
            MobileServiceContext context = new MobileServiceContext();
            DomainManager = new EntityDomainManager<GiraRequestAcknowledge>(context, Request, Services);
        }

        // GET tables/GiraRequestAcknowledge
        public IQueryable<GiraRequestAcknowledge> GetAllGiraRequestAcknowledge()
        {
            return Query(); 
        }

        // GET tables/GiraRequestAcknowledge/48D68C86-6EA6-4C25-AA33-223FC9A27959
        public SingleResult<GiraRequestAcknowledge> GetGiraRequestAcknowledge(string id)
        {
            return Lookup(id);
        }

        // PATCH tables/GiraRequestAcknowledge/48D68C86-6EA6-4C25-AA33-223FC9A27959
        public Task<GiraRequestAcknowledge> PatchGiraRequestAcknowledge(string id, Delta<GiraRequestAcknowledge> patch)
        {
             return UpdateAsync(id, patch);
        }

        // POST tables/GiraRequestAcknowledge
        public async Task<IHttpActionResult> PostGiraRequestAcknowledge(GiraRequestAcknowledge item)
        {
            GiraRequestAcknowledge current = await InsertAsync(item);
            return CreatedAtRoute("Tables", new { id = current.Id }, current);
        }

        // DELETE tables/GiraRequestAcknowledge/48D68C86-6EA6-4C25-AA33-223FC9A27959
        public Task DeleteGiraRequestAcknowledge(string id)
        {
             return DeleteAsync(id);
        }

    }
}