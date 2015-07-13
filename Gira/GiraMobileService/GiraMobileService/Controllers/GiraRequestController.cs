using System;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Controllers;
using System.Web.Http.OData;
using Microsoft.WindowsAzure.Mobile.Service;
using GiraMobileService.DataObjects;
using GiraMobileService.Models;
using Microsoft.WindowsAzure.Mobile.Service.Security;

namespace GiraMobileService.Controllers
{
    public class GiraRequestController : TableController<GiraRequest>
    {
        protected override void Initialize(HttpControllerContext controllerContext)
        {
            base.Initialize(controllerContext);
            MobileServiceContext context = new MobileServiceContext();
            DomainManager = new EntityDomainManager<GiraRequest>(context, Request, Services);
        }

        // GET tables/GiraRequest
        public IQueryable<GiraRequest> GetAllGiraRequest()
        {
            return Query(); 
        }

        // GET tables/GiraRequest/48D68C86-6EA6-4C25-AA33-223FC9A27959
        public SingleResult<GiraRequest> GetGiraRequest(string id)
        {
            return Lookup(id);
        }

        // PATCH tables/GiraRequest/48D68C86-6EA6-4C25-AA33-223FC9A27959
        [AuthorizeLevel(AuthorizationLevel.User)]
        public Task<GiraRequest> PatchGiraRequest(string id, Delta<GiraRequest> patch)
        {
            ServiceUser user = User as ServiceUser;
            if (user == null)
            {
                throw new InvalidOperationException("This can only be called by authenticated clients");
            }


            return UpdateAsync(id, patch);
        }

        // POST tables/GiraRequest
        [AuthorizeLevel(AuthorizationLevel.User)]
        public async Task<IHttpActionResult> PostGiraRequest(GiraRequest item)
        {
            GiraRequest current = await InsertAsync(item);
            return CreatedAtRoute("Tables", new { id = current.Id }, current);
        }

        // DELETE tables/GiraRequest/48D68C86-6EA6-4C25-AA33-223FC9A27959
        public Task DeleteGiraRequest(string id)
        {
             return DeleteAsync(id);
        }



    }
}