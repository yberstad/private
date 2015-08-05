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

RCT_EXPORT_METHOD(readWithCompletion:(NSString *) tableName
                              userid:(NSString *) userid
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
      
      NSMutableArray *giraRequestItems = [[NSMutableArray alloc] init];
      for(NSDictionary *item in result.items) { // items is NSArray of records that match query
        NSMutableDictionary *giraRequestItem = [[NSMutableDictionary alloc] init];
       
        for (id key in item) {
          id newItem = [item objectForKey:key];
          if ([newItem isKindOfClass:[NSDate class]]){
            NSDateFormatter *dateFormat = [[NSDateFormatter alloc] init];
            [dateFormat setDateFormat: @"yyyy-MM-dd HH:mm:ss zzz"];
            NSString *stringFromDate = [dateFormat stringFromDate:newItem];
  
            [giraRequestItem setObject:stringFromDate forKey:key];
          }
          else{
            [giraRequestItem setObject:newItem forKey:key];
          }
        }
        [giraRequestItems addObject:giraRequestItem];
      }
       /* CODE FOR TRYING TO HANDLE THE NSTAGGEDDATE WHEN RUNNING IPHONE 6.
        giraRequestItem[@"location"] = [item objectForKey:@"location"];
        id oldDate = [item objectForKey:@"date"];
        Class valueClass = [oldDate classForCoder] ?: [oldDate class];
        if ([oldDate isKindOfClass:[NSDate class]]){
          unsigned unitFlags = NSYearCalendarUnit | NSMonthCalendarUnit |  NSDayCalendarUnit;
          NSCalendar * cal = [NSCalendar currentCalendar];
          NSDateComponents *comps = [cal components:unitFlags fromDate:oldDate];
          NSDate *newDate = [cal dateFromComponents:comps];
          [giraRequestItem setObject:newDate forKey:@"date"];
        }
        [giraRequestItems addObject:giraRequestItem];
        NSLog(@"Table Item: %@", [item objectForKey:@"date"]);
        
      }
       
      NSArray *giraRequestItems = result.items;
      */
      callback(@[[NSNull null], giraRequestItems]);
    }
  }];
};


RCT_EXPORT_METHOD(insertGiraRequest:(NSString *) location
                               date:(NSString *) date
                          startTime:(NSString *) startTime
                           stopTime:(NSString *) stopTime
                             allDay:(NSString *) allDay
                        description:(NSString *) description
                      giraTypeRefId:(NSString *) giraTypeRefId
                             userid:(NSString *) userid
                              token:(NSString *) token
                           callback:(RCTResponseSenderBlock)callback)
{
  
  MSClient *client = [MSClient clientWithApplicationURLString:@"https://giramobileservice.azure-mobile.net/"
                                               applicationKey:@"eXVPAWPzwWRkMbTgjqmolczVUtfpyo18"];
  MSUser *user = [[MSUser alloc] initWithUserId:userid];
  user.mobileServiceAuthenticationToken = token;
  client.currentUser = user;
  
  MSTable *table = [client tableWithName:@"GiraRequest"];
  NSDictionary *newItem = @{@"location": location,
                            @"date": date,
                            @"startTime": startTime,
                            @"stopTime": stopTime,
                            @"allDay": allDay,
                            @"description": description,
                            @"giraTypeRefId": giraTypeRefId};
  
  [table insert:newItem completion:^(NSDictionary *result, NSError *error) {
    if(error) { // error is nil if no error occured
      NSLog(@"ERROR %@", error);
      callback(@[@"Error", [NSNull null]]);
    } else {
      callback(@[[NSNull null], result]);
    }
  }];
};

@end

