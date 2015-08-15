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

@end

