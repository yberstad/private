using System;
using System.Data.Entity;
using System.Data.Entity.Core.Objects;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Controllers;
using System.Web.Http.OData;
using Microsoft.WindowsAzure.Mobile.Service;
using GiraMobileService.DataObjects;
using GiraMobileService.DataObjects.Models;
using GiraMobileService.Models;
using Microsoft.WindowsAzure.Mobile.Service.Security;

namespace GiraMobileService.Controllers
{
    public class GiraRequestAcknowledgeController : TableController<GiraRequestAcknowledge>
    {
        private MobileServiceContext _context;

        protected override void Initialize(HttpControllerContext controllerContext)
        {
            base.Initialize(controllerContext);
            _context = new MobileServiceContext();
            DomainManager = new EntityDomainManager<GiraRequestAcknowledge>(_context, Request, Services);
        }

        // GET tables/GiraRequestAcknowledge
        public IQueryable<GiraRequestChatModel> GetAllGiraRequestAcknowledge(string giraRequestId)
        {
            try
            {
                _context.Database.Log = Log;
                var giraChatList = from chat in _context.GiraRequestAcknowledges
                    where chat.GiraRequestRefId == giraRequestId
                    join user in _context.GiraUsers on chat.CreatedBy equals user.Id
                    select new GiraRequestChatModel()
                    {
                        Message = chat.Message,
                        Id = chat.Id,
                        Date = chat.CreatedAt,
                        CreatedBy = chat.CreatedBy,
                        CreatedByUserName = user.UserName,
                        CreatedByUserId = user.UserId
                    };
                return giraChatList;
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
            }

            return null;
        }

        private DateTime GetDateTime(DateTimeOffset? dateTimeOffset)
        {
            return dateTimeOffset?.DateTime ?? DateTime.MinValue;
        }
        private void Log(string log)
        {
            System.Diagnostics.Debug.WriteLine(log);
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
        [AuthorizeLevel(AuthorizationLevel.User)]
        public async Task<IHttpActionResult> PostGiraRequestAcknowledge(GiraRequestAcknowledge item)
        {
            ServiceUser user = User as ServiceUser;
            if (user == null)
            {
                throw new InvalidOperationException("This can only be called by authenticated clients");
            }

            GiraUser localUser = _context.GiraUsers.FirstOrDefault(x => x.UserId == user.Id);
            if (localUser == null)
            {
                throw new InvalidOperationException("Invalid user");
            }

            GiraRequestAcknowledge newChatMessage = new GiraRequestAcknowledge
            {
                CreatedBy = localUser.Id,
                GiraRequestRefId = item.GiraRequestRefId,
                GiraUserRefId = localUser.Id,
                Message = item.Message
            };

            GiraRequestAcknowledge current = await InsertAsync(newChatMessage);
            return CreatedAtRoute("Tables", new { id = current.Id }, current);
        }

        // DELETE tables/GiraRequestAcknowledge/48D68C86-6EA6-4C25-AA33-223FC9A27959
        public Task DeleteGiraRequestAcknowledge(string id)
        {
             return DeleteAsync(id);
        }

    }
}