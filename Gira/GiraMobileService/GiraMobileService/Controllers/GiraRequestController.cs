using System;
using System.Collections.ObjectModel;
using System.Data.Entity;
using System.Data.SqlTypes;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Controllers;
using System.Web.Http.OData;
using GiraMobileService.DataObjects;
using GiraMobileService.DataObjects.Models;
using GiraMobileService.Models;
using Microsoft.WindowsAzure.Mobile.Service;
using Microsoft.WindowsAzure.Mobile.Service.Security;
using Newtonsoft.Json.Linq;

namespace GiraMobileService.Controllers
{
    //[AuthorizeLevel(AuthorizationLevel.User)]
    public class GiraRequestController : TableController<GiraRequest>
    {
        MobileServiceContext _context;

        protected override void Initialize(HttpControllerContext controllerContext)
        {
            base.Initialize(controllerContext);
            _context = new MobileServiceContext();
            DomainManager = new EntityDomainManager<GiraRequest>(_context, Request, Services);
        }

        // GET tables/GiraRequest
        public IQueryable<GiraRequestModel> GetAllGiraRequest()
        {
            _context.Database.Log = Log;
            var giraRequestList = from g in _context.GiraRequests.Include(g => g.Type)
                join user in _context.GiraUsers on g.CreatedBy equals user.Id
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
                                      Location = g.Location,
                                      CreatedByUserName = user.UserName,
                                      CreatedByUserId = user.UserId
                                  };
            return giraRequestList;
        }

        private void Log(string log)
        {
            System.Diagnostics.Debug.WriteLine(log);
        }
        // GET tables/GiraRequest/48D68C86-6EA6-4C25-AA33-223FC9A27959
        public SingleResult<GiraRequest> GetGiraRequest(string id)
        {
            return Lookup(id);
        }

        //public async Task<GiraRequest> GetGiraRequestById(string id)
        //{
        //    ServiceUser user = User as ServiceUser;
        //    if (user != null)
        //    {
        //        GiraUser localUser = _context.GiraUser.FirstOrDefault(x => x.UserId == user.Id);
        //        if (localUser == null)
        //        {
        //            await NewLocalUser(user);
        //        }
        //    }

        //    List<GiraRequest> list = await _context.GiraRequests.Where(x => x.Id == id).ToListAsync();
        //    return list.FirstOrDefault();
        //}

        // PATCH tables/GiraRequest/48D68C86-6EA6-4C25-AA33-223FC9A27959
        [AuthorizeLevel(AuthorizationLevel.User)]
        public async Task<GiraRequest> PatchGiraRequest(string id, Delta<GiraRequest> patch)
        {
            ServiceUser user = User as ServiceUser;
            if (user == null)
            {
                throw new InvalidOperationException("This can only be called by authenticated clients");
            }

            GiraUser localUser = _context.GiraUsers.FirstOrDefault(x => x.UserId == user.Id);
            if (localUser == null)
            {
                await NewLocalUser(user);
            }

            return await UpdateAsync(id, patch);
        }

        private async Task<GiraUser> NewLocalUser(ServiceUser user)
        {
            Collection<ProviderCredentials> identities = await user.GetIdentitiesAsync();
            JObject result = new JObject();
            FacebookCredentials fb = identities.OfType<FacebookCredentials>().FirstOrDefault();
            if (fb != null)
            {
                var accessToken = fb.AccessToken;
                result.Add("facebook", await GetProviderInfo("https://graph.facebook.com/me?fields=id,name,email&access_token=" + accessToken));
            }

            GiraUser newLocalUser = new GiraUser
            {
                UserId = user.Id
            };
            if (result["facebook"] != null)
            {
                newLocalUser.Email = (result["facebook"]["email"] != null) ? result["facebook"]["email"].Value<String>() : string.Empty;
                newLocalUser.UserName = (result["facebook"]["name"] != null) ? result["facebook"]["name"].Value<String>() : string.Empty;
            }

            var giraUserDomainManager = new EntityDomainManager<GiraUser>(_context, Request, Services);
            return await giraUserDomainManager.InsertAsync(newLocalUser);
        }

        private async Task<JToken> GetProviderInfo(string url)
        {
            var c = new HttpClient();
            var resp = await c.GetAsync(url);
            resp.EnsureSuccessStatusCode();
            return JToken.Parse(await resp.Content.ReadAsStringAsync());
        }

        // POST tables/GiraRequest
        [AuthorizeLevel(AuthorizationLevel.User)]
        public async Task<IHttpActionResult> PostGiraRequest(GiraRequest item)
        {
            ServiceUser user = User as ServiceUser;
            if (user == null)
            {
                throw new InvalidOperationException("This can only be called by authenticated clients");
            }

            GiraUser localUser = _context.GiraUsers.FirstOrDefault(x => x.UserId == user.Id);
            if (localUser == null)
            {
                await NewLocalUser(user);
            }

            GiraRequest newGiraRequest = new GiraRequest
            {
                CreatedBy = localUser != null ? localUser.Id : user.Id,
                Date = item.Date,
                Description = item.Description,
                Enabled = true,
                Location = item.Location,
                GiraTypeRefId = item.GiraTypeRefId,
                AllDay = item.AllDay,
                StartTime = (item.StartTime == DateTime.MinValue) ? SqlDateTime.MinValue.Value : item.StartTime,
                StopTime = (item.StopTime == DateTime.MinValue) ? SqlDateTime.MinValue.Value : item.StopTime
            };

            GiraRequest current = await InsertAsync(newGiraRequest);
            return CreatedAtRoute("Tables", new { id = current.Id }, current);
        }

        // DELETE tables/GiraRequest/48D68C86-6EA6-4C25-AA33-223FC9A27959
        [AuthorizeLevel(AuthorizationLevel.User)]
        public Task DeleteGiraRequest(string id)
        {
             return DeleteAsync(id);
        }



    }
}