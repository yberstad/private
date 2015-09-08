using System.Data.Entity.Migrations;
using System.Web.Http;
using System.Web.Http.OData.Builder;
using System.Web.Http.OData.Extensions;
using GiraMobileService.Migrations;
using Microsoft.WindowsAzure.Mobile.Service;
using GiraMobileService.DataObjects;
using GiraMobileService.DataObjects.Models;

namespace GiraMobileService
{
    public static class WebApiConfig
    {
        public static void Register()
        {
            // Use this class to set configuration options for your mobile service  
            ConfigOptions options = new ConfigOptions();

            // Use this class to set WebAPI configuration options  
            HttpConfiguration config = ServiceConfig.Initialize(new ConfigBuilder(options));

            // To display errors in the browser during development, uncomment the following  
            // line. Comment it out again when you deploy your service for production use.  
            config.IncludeErrorDetailPolicy = IncludeErrorDetailPolicy.Always;

            //config.SetIsHosted(true);

            var migrator = new DbMigrator(new Configuration());
            migrator.Update();

            ODataConventionModelBuilder builder = new ODataConventionModelBuilder();
            builder.EntitySet<GiraRequestModel>("GiraRequestsOdata");
            builder.EntitySet<GiraType>("GiraTypes");
            config.Routes.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
        }
    }
}

