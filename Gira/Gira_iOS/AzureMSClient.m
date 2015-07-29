//
//  AzureMSClient.m
//  Gira_iOS
//
//  Created by Øyvind Habberstad on 25/07/15.
//  Copyright (c) 2015 Facebook. All rights reserved.
//

@import UIKit;

#import "AzureMSClient.h"
#import "WindowsAzureMobileServices/WindowsAzureMobileServices.h"

@implementation AzureMSClient

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(loginWithProvider2:(NSString *)provider
                         controller:(UIViewController *)controller
                           animated:(BOOL)animated
                           callback:(RCTResponseSenderBlock)callback)
{

  MSClient *client = [MSClient clientWithApplicationURLString:@"https://giramobileservice.azure-mobile.net/"
                                               applicationKey:@"eXVPAWPzwWRkMbTgjqmolczVUtfpyo18"];
  
  [client loginWithProvider:provider
                 controller:controller
                   animated:animated
                 completion:^(MSUser *user, NSError *error) {
                   if(error){
                     NSLog(@"Error calling login: %@", error);
                     callback(@[@"Error", [NSNull null]]);
                   }
                   else{
                     NSLog(@"Logged in as %@", user.userId);
                     NSDictionary *credentials = @{ @"userId": user.userId, @"token" : user.mobileServiceAuthenticationToken};
                     callback(@[[NSNull null], credentials]);
                   }
  }];

};


RCT_EXPORT_METHOD(loginWithProvider:(NSString *)provider
                  callback:(RCTResponseSenderBlock)callback)
{
  MSClient *client = [MSClient clientWithApplicationURLString:@"https://giramobileservice.azure-mobile.net/"
                                               applicationKey:@"eXVPAWPzwWRkMbTgjqmolczVUtfpyo18"];

  dispatch_async(dispatch_get_main_queue(), ^{
    UIWindow *keyWindow = [[UIApplication sharedApplication] keyWindow];
    UIViewController *rootViewController = keyWindow.rootViewController;
    
    
    MSLoginController *controller =
    [client loginViewControllerWithProvider:provider
                                 completion:^(MSUser *user, NSError *error) {
                                   if (error) {
                                     NSLog(@"Error calling login: %@", error);
                                     callback(@[@"Error", [NSNull null]]);
                                   } else {
                                     NSLog(@"Logged in as %@", user.userId);
                                     NSDictionary *credentials = @{ @"userId": user.userId, @"token" : user.mobileServiceAuthenticationToken};
                                     callback(@[[NSNull null], credentials]);

                                   }
                                   [rootViewController dismissViewControllerAnimated:YES completion:nil];
                                 }];
    
    [rootViewController presentViewController:controller
                                     animated:YES
                                   completion: nil];
  });
}

RCT_EXPORT_METHOD(readWithCompletion:(NSString *) tableName
                              userid:(NSString *)userid
                               token:(NSString *) token
                            callback:(RCTResponseSenderBlock)callback)
{
  
  MSClient *client = [MSClient clientWithApplicationURLString:@"https://giramobileservice.azure-mobile.net/"
                                               applicationKey:@"eXVPAWPzwWRkMbTgjqmolczVUtfpyo18"];
  MSUser *user = [[MSUser alloc] initWithUserId:userid];
  user.mobileServiceAuthenticationToken = token;
  client.currentUser = user;
  
  MSTable *table = [client tableWithName:tableName];
  
  [table readWithCompletion:^(MSQueryResult *result, NSError *error) {
    if(error) { // error is nil if no error occured
      NSLog(@"ERROR %@", error);
      callback(@[@"Error", [NSNull null]]);
    } else {
      NSArray *todoItems = result.items;
      for(NSDictionary *item in result.items) { // items is NSArray of records that match query
        NSLog(@"Table Item: %@", [item objectForKey:@"text"]);
      }
      callback(@[[NSNull null], todoItems]);
    }
  }];
};
@end
