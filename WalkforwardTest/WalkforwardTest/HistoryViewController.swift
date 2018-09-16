//
//  HistoryViewController.swift
//  WalkforwardTest
//
//  Created by Heinrich Malan on 6/9/18.
//  Copyright © 2018 Heinrich Malan. All rights reserved.
//

import UIKit
import CoreLocation
import CoreData

class HistoryViewController: UIViewController, UITableViewDataSource, CLLocationManagerDelegate, WalksDelegate {
    // MARK: Properties
    
    @IBOutlet weak var TextLabel: UILabel!
    
    @IBOutlet weak var NoWalksLabel: UILabel!
    @IBOutlet weak var tableView: UITableView!
    var walks: [NSManagedObject] = []
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
        title = "Walk History"
        tableView.dataSource = self as UITableViewDataSource
        tableView.register(UITableViewCell.self, forCellReuseIdentifier: "Cell")
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        tableView.isHidden = true
        NoWalksLabel.isHidden = false
        getAndSetWalks()
        
        tableView.reloadData()
        if walks.count > 0 {
            tableView.isHidden = false
            NoWalksLabel.isHidden = true
        }
    }
    
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return walks.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "Cell", for: indexPath)
        let duration = walks[indexPath.row].value(forKey: "duration") as! Int64
        let distance = walks[indexPath.row].value(forKey: "distance") as! Double
        let steps = walks[indexPath.row].value(forKey: "steps") as! Int64
        var date: Date = Date()
        if walks[indexPath.row].value(forKey: "date") != nil {
            date = walks[indexPath.row].value(forKey: "date") as! Date
        }
        
        let cellString = String(date.description(with: .current)) + "\nSteps: " + String(steps) + "\nDistance: " + String(distance) + "\nDuration: " + generateDurationString(duration: duration)
        
        cell.textLabel?.numberOfLines = 0;
        cell.textLabel?.lineBreakMode = .byWordWrapping;
        cell.textLabel?.text = cellString
        return cell
    }
    
    func tableView(_ tableView: UITableView, commit editingStyle: UITableViewCellEditingStyle, forRowAt indexPath: IndexPath) {
        if editingStyle == .delete {
            guard let appDelegate = UIApplication.shared.delegate as? AppDelegate else {
                return
            }
            
            let managedContext = appDelegate.persistentContainer.viewContext
            
            let fetchRequest = NSFetchRequest<NSManagedObject>(entityName: "Walk")
            var result: [NSManagedObject]?
            do {
                result = try managedContext.fetch(fetchRequest)
                for object in result! {
                    if object == walks[indexPath.row]{
                        print("Matching object found")
                        managedContext.delete(object)
                        try managedContext.save()
                    } else {
                        print("No matching object found")
                    }
                }
                
                self.walks.remove(at: indexPath.row)
                tableView.deleteRows(at: [indexPath], with: .fade)
                
                if walks.count == 0 {
                    tableView.isHidden = true
                    NoWalksLabel.isHidden = false
                }
            } catch let error as NSError {
                print("Could not fetch. \(error), \(error.userInfo)")
            }
        }
    }
    
    func generateDurationString(duration: Int64) -> String {
        var durationString = ""
        
        let seconds = duration % 60
        var minutes = duration - seconds
        let hours = (minutes - minutes%60)/60
        if hours > 0 {
            minutes = minutes % 60
            durationString = String(hours) + " hours " + String(minutes) + " minutes " + String(seconds) + " seconds"
        } else {
            durationString = String(minutes) + " minutes " + String(seconds) + " seconds"
        }
        
        return durationString
    }
    
    func getAndSetWalks() {
        guard let appDelegate = UIApplication.shared.delegate as? AppDelegate else {
            return
        }
        
        let managedContext = appDelegate.persistentContainer.viewContext
        
        let fetchRequest = NSFetchRequest<NSManagedObject>(entityName: "Walk")
        
        do {
            walks = try managedContext.fetch(fetchRequest)
        } catch let error as NSError {
            print("Could not fetch. \(error), \(error.userInfo)")
        }
    }
}
