namespace GiraMobileService.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class FourthMigration : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("GiraMobileService.GiraSubscriptions", "Id", "GiraMobileService.GiraTypes");
            DropIndex("GiraMobileService.GiraSubscriptions", new[] { "Id" });
            AddColumn("GiraMobileService.GiraRequests", "StartTime", c => c.DateTime(nullable: false));
            AddColumn("GiraMobileService.GiraRequests", "StopTime", c => c.DateTime(nullable: false));
            AddColumn("GiraMobileService.GiraRequests", "AllDay", c => c.Boolean(nullable: false));
            AddColumn("GiraMobileService.GiraSubscriptions", "StartTime", c => c.DateTime(nullable: false));
            AddColumn("GiraMobileService.GiraSubscriptions", "StopTime", c => c.DateTime(nullable: false));
            AddColumn("GiraMobileService.GiraSubscriptions", "AllDay", c => c.Boolean(nullable: false));
            AddColumn("GiraMobileService.GiraSubscriptions", "Description", c => c.String());
            AddColumn("GiraMobileService.GiraSubscriptions", "Enabled", c => c.Boolean(nullable: false));
            AddColumn("GiraMobileService.GiraSubscriptions", "GiraTypeRefId", c => c.String(maxLength: 128));
            CreateIndex("GiraMobileService.GiraSubscriptions", "GiraTypeRefId");
            AddForeignKey("GiraMobileService.GiraSubscriptions", "GiraTypeRefId", "GiraMobileService.GiraTypes", "Id");
            DropColumn("GiraMobileService.GiraSubscriptions", "GiraSubscriptionId");
            DropColumn("GiraMobileService.GiraSubscriptions", "Time");
        }
        
        public override void Down()
        {
            AddColumn("GiraMobileService.GiraSubscriptions", "Time", c => c.DateTime(nullable: false));
            AddColumn("GiraMobileService.GiraSubscriptions", "GiraSubscriptionId", c => c.Int(nullable: false));
            DropForeignKey("GiraMobileService.GiraSubscriptions", "GiraTypeRefId", "GiraMobileService.GiraTypes");
            DropIndex("GiraMobileService.GiraSubscriptions", new[] { "GiraTypeRefId" });
            DropColumn("GiraMobileService.GiraSubscriptions", "GiraTypeRefId");
            DropColumn("GiraMobileService.GiraSubscriptions", "Enabled");
            DropColumn("GiraMobileService.GiraSubscriptions", "Description");
            DropColumn("GiraMobileService.GiraSubscriptions", "AllDay");
            DropColumn("GiraMobileService.GiraSubscriptions", "StopTime");
            DropColumn("GiraMobileService.GiraSubscriptions", "StartTime");
            DropColumn("GiraMobileService.GiraRequests", "AllDay");
            DropColumn("GiraMobileService.GiraRequests", "StopTime");
            DropColumn("GiraMobileService.GiraRequests", "StartTime");
            CreateIndex("GiraMobileService.GiraSubscriptions", "Id");
            AddForeignKey("GiraMobileService.GiraSubscriptions", "Id", "GiraMobileService.GiraTypes", "Id");
        }
    }
}
