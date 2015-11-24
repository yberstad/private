namespace GiraMobileService.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class SixthMigration : DbMigration
    {
        public override void Up()
        {
            AddColumn("GiraMobileService.GiraRequests", "UsePrivateConversation", c => c.Boolean(nullable: false));
            DropColumn("GiraMobileService.GiraRequestAcknowledges", "ShowContactInfo");
        }
        
        public override void Down()
        {
            AddColumn("GiraMobileService.GiraRequestAcknowledges", "ShowContactInfo", c => c.Boolean(nullable: false));
            DropColumn("GiraMobileService.GiraRequests", "UsePrivateConversation");
        }
    }
}
