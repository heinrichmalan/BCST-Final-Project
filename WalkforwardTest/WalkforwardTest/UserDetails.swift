//
//  UserDetails.swift
//  WalkAroundTheBlock
//
//  Created by Heinrich Malan on 17/10/18.
//  Copyright © 2018 Heinrich Malan. All rights reserved.
//

import UIKit
import CoreData

class UserDetails: UIViewController {
    var firstName: String = ""
    var lastName: String = ""
    //MARK: Properties
    @IBOutlet weak var loginButton: UIButton!
    @IBOutlet weak var nameLabel: UILabel!
    @IBOutlet weak var scrollView: UIScrollView!
    

    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view.
    }
    
    override func viewDidAppear(_ animated: Bool) {
        
        let appDelegate = (UIApplication.shared.delegate as! AppDelegate)
        let context = appDelegate.persistentContainer.viewContext
        
        let fetchRequest = NSFetchRequest<NSManagedObject>(entityName: "UserInfo")
        var result: [NSManagedObject]?
        do {
            result = try context.fetch(fetchRequest)
            print(result!.count)
            if result!.count == 1 {
                let userInfo = result![0]
                firstName = userInfo.value(forKey: "firstName") as! String? ?? "John"
                lastName = userInfo.value(forKey: "lastName") as! String? ?? "Doe"
                loginButton.setTitle("Logout", for: .normal)
                nameLabel.text = firstName + " " + lastName
                nameLabel.isHidden = false;
            } else {
                for object in result! {
                    context.delete(object)
                }
                nameLabel.isHidden = true;
                try context.save()
            }
        } catch let error as NSError {
            print("Could not fetch. \(error), \(error.userInfo)")
        }
    }
    
    @IBAction func handleLoginButton(_ sender: Any) {
        if loginButton.currentTitle == "Patient Login" {
            performSegue(withIdentifier: "loginSegue", sender: self)
        } else {
            let appDelegate = (UIApplication.shared.delegate as! AppDelegate)
            let context = appDelegate.persistentContainer.viewContext
            
            let fetchRequest = NSFetchRequest<NSManagedObject>(entityName: "UserInfo")
            var result: [NSManagedObject]?
            do {
                result = try context.fetch(fetchRequest)
                for object in result! {
                    context.delete(object)
                }
                try context.save()
            } catch let error as NSError {
                print("Could not fetch. \(error), \(error.userInfo)")
            }
            loginButton.setTitle("Patient Login", for: .normal)
            nameLabel.isHidden = true;
        }
        
    }
    
    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using segue.destination.
        // Pass the selected object to the new view controller.
    }
    */

}
