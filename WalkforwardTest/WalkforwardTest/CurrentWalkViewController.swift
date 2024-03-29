//
//  CurrentWalkViewController.swift
//  WalkAroundTheBlock
//
//  Created by Heinrich Malan on 1/10/18.
//  Copyright © 2018 Heinrich Malan. All rights reserved.
//

import UIKit
import CoreLocation
import CoreData
import CoreMotion
import AVFoundation

class CurrentWalkViewController: UIViewController, CLLocationManagerDelegate {
    var running = false;
    let locationMgr: CLLocationManager = CLLocationManager();
    var walkLocations: [CLLocation] = [];
    var appDelegate: AppDelegate?
    var context: NSManagedObjectContext?
    var entity: NSEntityDescription?
    let motionMgr = CMMotionManager()
    let pedometer = CMPedometer()
    var goalVibeDone = false
    var goalType: String = "distance"
    var goalValue: Int = 0
    var walkStats: WalkStats?
    var timer: Timer?
    var timeCounter: Double = 0.0
    var pctProgress: Float = 0.0
    var paused = false
    var fromHistory: Bool = false
    
    let GOAL_NOT_MET_STRING = "Almost there! You achieved %d%% of your goal. Try harder next time to meet your goal!"
    let GOAL_MET_STRING = "Well done! You met your goal with %d%%! Keep it up!"
    let GOAL_EXCEEDED_STRING = "Fantastic! You exceeded your goal getting %d%%!"
    let BUTTON_PURPLE: UIColor = UIColor(displayP3Red: 88/255.0, green: 86/255.0, blue: 214/255.0, alpha: 1.0)
    
    // MARK: Properties
    @IBOutlet weak var stepCountLabel: UILabel!
    @IBOutlet weak var durationLabel: UILabel!
    @IBOutlet weak var distanceLabel: UILabel!
    @IBOutlet weak var distancePaceLabel: UILabel!
    @IBOutlet weak var stepPaceLabel: UILabel!
    @IBOutlet weak var goalProgressBar: UIProgressView!
    @IBOutlet weak var stopButtonOutlet: UIButton!
    @IBOutlet weak var pauseButtonOutlet: UIButton!
    @IBOutlet weak var goalLabel: UILabel!
    

    override func viewDidLoad() {
        super.viewDidLoad()
        goalProgressBar.layer.cornerRadius = 4
        goalProgressBar.clipsToBounds = true
        goalProgressBar.progressTintColor = UIColor(displayP3Red: 1.0, green: 0.0, blue: 0.0, alpha: 1.0)
        stopButtonOutlet.layer.cornerRadius = 5
        pauseButtonOutlet.layer.cornerRadius = 5
        pauseButtonOutlet.backgroundColor = UIColor(displayP3Red: 1.0, green: 149/255.0, blue: 0.0, alpha: 1.0)
        
        if !fromHistory {
            appDelegate = (UIApplication.shared.delegate as! AppDelegate)
            context = appDelegate!.persistentContainer.viewContext
            entity = NSEntityDescription.entity(forEntityName: "Walk", in: context!)!
            locationMgr.delegate = self as CLLocationManagerDelegate
            locationMgr.allowsBackgroundLocationUpdates = true
            
            running = true
            walkStats = WalkStats()
            setGoalLabel()
            goalVibeDone = false
            timeCounter = 0.0
            timer = Timer.scheduledTimer(timeInterval: 1.0, target: self, selector: #selector(UpdateTimer), userInfo: nil, repeats: true)
            
            if !startReceivingLocationChanges() {
                //durationLabel.text = "Error getting location. Please ensure that location services are enabled."
                print("Error getting location updates")
                return
            }
            if !startRecievingPedometerChanges() {
                //stepsLabel.text = "Error getting pedometer data. Please ensure that motion permissions are enabled."
                print("Error getting pedometer updates")
                //return
            }
        } else {
            setTimerString((walkStats?.getDuration())!)
            setDistanceLabel((walkStats?.getDistance())!)
            let duration = (walkStats?.getDuration())!
            timeCounter = duration
            setDistancePaceLabe((walkStats?.getDistance())!, duration)
            setStepsLabel((walkStats?.getSteps())!)
            setStepsPaceLabe((walkStats?.getSteps())!, duration)
            setGoalLabel()
            setProgressBar()
            setStopPauseButtonsToFinish()
        }
        
        // Do any additional setup after loading the view.
    }
    
    @IBAction func handlePauseButtonTap(_ sender: Any) {
        if !paused {
            timer!.invalidate()
            pauseButtonOutlet.backgroundColor = UIColor(displayP3Red: 76/255.0, green: 217/255.0, blue: 100/255.0, alpha: 1.0)
            pauseButtonOutlet.setTitle("Resume Walk", for: .normal)
            paused = true
        } else {
            paused = false
            pauseButtonOutlet.backgroundColor = UIColor(displayP3Red: 1.0, green: 149/255.0, blue: 0.0, alpha: 1.0)
            timer = Timer.scheduledTimer(timeInterval: 1.0, target: self, selector: #selector(UpdateTimer), userInfo: nil, repeats: true)
            pauseButtonOutlet.setTitle("Pause Walk", for: .normal)
        }
    }
    
    func setStopPauseButtonsToFinish() {
        pauseButtonOutlet.isHidden = true
        stopButtonOutlet.setTitle("Finish", for: .normal)
        stopButtonOutlet.backgroundColor = BUTTON_PURPLE
    }
    
    @IBAction func handleStopButtonTap(_ sender: Any) {
        if running {
            locationMgr.stopUpdatingLocation()
            timer!.invalidate()
            pedometer.stopUpdates()
            running = false
            walkStats!.endWalk()
            
            saveWalk()
            var stringToUse = GOAL_MET_STRING
            if pctProgress < 1.0 {
                stringToUse = GOAL_NOT_MET_STRING
            } else if pctProgress < 1.25 {
                stringToUse = GOAL_MET_STRING
            } else {
                stringToUse = GOAL_EXCEEDED_STRING
            }
            
            if pctProgress.isNaN || pctProgress.isInfinite {
                pctProgress = 0.0
            }
            
            let alertController = UIAlertController(title: "Finished!", message: String(format: stringToUse, Int(pctProgress*100)), preferredStyle: UIAlertControllerStyle.alert)
            
            alertController.addAction(UIAlertAction(title: "Dismiss", style: UIAlertActionStyle.default,handler: nil))
            setStopPauseButtonsToFinish()
            self.present(alertController, animated: true, completion: nil)
        } else {
            WalkSyncing.syncWalkItems()
            dismiss(animated: true, completion: nil)
        }
    }
    
    func setTimerString(_ seconds: TimeInterval) {
        let dcFormatter = DateComponentsFormatter()
        dcFormatter.unitsStyle = .full
        dcFormatter.allowedUnits = [.minute, .second, .hour]
        durationLabel.text = String(dcFormatter.string(from: seconds as TimeInterval)!)
    }
    
    func setProgressBar() {
        var pctProgress = 0.0
        switch (goalType) {
        case "minutes":
            pctProgress = timeCounter/Double(goalValue*60)
            break
        case "steps":
            pctProgress = Double((walkStats?.getSteps())!)/Double(goalValue)
            break
        case "distance":
            pctProgress = Double((walkStats?.getDistance())!)/Double(goalValue)
            break
        default:
            break
        }
        
        goalProgressBar.progress = Float(pctProgress)
        setProgressColour(Float(pctProgress))
    }
    
    @objc func UpdateTimer() {
        
        timeCounter += 1
        if goalType == "minutes" {
            self.pctProgress = Float(timeCounter)/Float(goalValue*60)
            goalProgressBar.progress = self.pctProgress
            setProgressColour(pctProgress)
            if pctProgress >= 1.0 && !self.goalVibeDone {
                AudioServicesPlaySystemSound(kSystemSoundID_Vibrate)
                self.goalVibeDone = true
            }
        }
        
        setTimerString(timeCounter as TimeInterval)
    }
    
    func setProgressColour(_ pctProgress: Float) {
        print(pctProgress)
        if pctProgress < 0.33 {
            goalProgressBar.progressTintColor = UIColor(displayP3Red: 1.0, green: 0.0, blue: 0.0, alpha: 1.0)
        } else if pctProgress < 0.66 {
            goalProgressBar.progressTintColor = UIColor(red:1.00, green:0.49, blue:0.00, alpha:1.0)
        } else if pctProgress < 0.85 {
            goalProgressBar.progressTintColor = UIColor(displayP3Red: 1.0, green: 215.0/255.0, blue: 0.0, alpha: 1.0)
        } else {
            goalProgressBar.progressTintColor = UIColor(displayP3Red: 127.0/255.0, green: 1.0, blue: 0.0, alpha: 1.0)
        }
    }
    
    func setGoalLabel(){
        var goalString = "Goal: " + String(goalValue)
        if goalType == "distance" {
            goalString += " meters"
        } else if goalType == "steps" {
            goalString += " steps"
        } else {
            let dcFormatter = DateComponentsFormatter()
            dcFormatter.unitsStyle = .full
            dcFormatter.allowedUnits = [.minute, .second, .hour]
            
            goalString = "Goal: " + String(dcFormatter.string(from: Double(goalValue)*60.0 as TimeInterval)!)
        }
        goalLabel.text = goalString
    }
    
    func startReceivingLocationChanges() -> Bool {
        let authStatus = CLLocationManager.authorizationStatus()
        if authStatus != .authorizedWhenInUse && authStatus != .authorizedAlways {
            print("Location status not authorised")
            return false
        }
        
        if !CLLocationManager.locationServicesEnabled() {
            print("Location services disabled")
            return false
        }
        
        locationMgr.desiredAccuracy = kCLLocationAccuracyBest
        locationMgr.distanceFilter = 15.0
        print("Starting to get location updates")
        locationMgr.requestAlwaysAuthorization()
        locationMgr.startUpdatingLocation()
        return true
    }
    
    func setDistanceLabel(_ meters: Int) {
        distanceLabel.text = String(meters) + " meters"
    }
    
    func setDistancePaceLabe(_ distance: Int, _ time: Double) {
        distancePaceLabel.text = distance > 0 ? String(format: "%.2f m/s", Double(distance)/self.timeCounter) : "0 m/s"
    }
    
    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]){
        let lastLocation = locations.last!
        filterAndAddLocation(lastLocation)
        
        let distance = Int(walkStats!.getDistanceFromWalks())
        setDistanceLabel(distance)
        setDistancePaceLabe(distance, timeCounter)
        if goalType == "distance" {
            self.pctProgress = Float(distance)/Float(goalValue)
            goalProgressBar.progress = self.pctProgress
            setProgressColour(pctProgress)
            if pctProgress >= 1.0 && !self.goalVibeDone {
                AudioServicesPlaySystemSound(kSystemSoundID_Vibrate)
                self.goalVibeDone = true
            }
        }
        
    }
    
    func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
        print("Location updates failed with error")
        print(error)
    }
    
    //Author Taka Mizutori
    //Source: https://medium.com/@mizutori/make-it-even-better-than-nike-how-to-filter-locations-tracking-highly-accurate-location-in-774be045f8d6
    func filterAndAddLocation(_ location: CLLocation) {
        let age = -location.timestamp.timeIntervalSinceNow
        
        if age > 10 {
            return
        }
        
        if location.horizontalAccuracy < 0{
            return
        }
        
        if location.horizontalAccuracy > 100{
            return
        }
        
        walkStats!.addWalkLocation(location: location)
        
    }
    
    func setStepsLabel(_ steps: Int) {
        stepCountLabel.text = String(steps)
    }
    
    func setStepsPaceLabe(_ steps: Int, _ time: Double) {
        stepPaceLabel.text = String(format: "%.2f", Double(steps)/((time)/60.0))
    }
    
    fileprivate func startRecievingPedometerChanges() -> Bool {
        if CMPedometer.isStepCountingAvailable() {
            pedometer.startUpdates(from: Date()) {
                [weak self] pedometerData, error in
                guard let pedometerData = pedometerData, error == nil else {return}
                
                DispatchQueue.main.async {
                    let numSteps = Int(truncating: pedometerData.numberOfSteps)
                    self!.walkStats!.addSteps(steps: numSteps)
                    self!.setStepsLabel(numSteps)
                    self!.setStepsPaceLabe(numSteps, self!.timeCounter)
                    if self!.goalType == "steps" {
                        self!.pctProgress = Float(numSteps)/Float(self!.goalValue)
                        self!.goalProgressBar.progress = self!.pctProgress
                        self!.setProgressColour(self!.pctProgress)
                        if self!.pctProgress >= 1.0 && !self!.goalVibeDone {
                            AudioServicesPlaySystemSound(kSystemSoundID_Vibrate)
                            self!.goalVibeDone = true
                        }
                    }
                }
            }
            return true
        } else {
            return false
        }
    }
    
    fileprivate func saveWalk() {
        let newWalk = NSManagedObject(entity: entity!, insertInto: context!)
        newWalk.setValue(timeCounter, forKey: "duration")
        newWalk.setValue(walkStats!.getSteps(), forKey: "steps")
        newWalk.setValue(walkStats!.getStartTime(), forKey: "date")
        newWalk.setValue(walkStats!.getDistance(), forKey: "distance")
        newWalk.setValue(goalType, forKey: "goal")
        newWalk.setValue(goalValue, forKey: "goalValue")
        newWalk.setValue(false, forKey: "synched")
        do {
            try context!.save()
        } catch {
            print("Failed saving")
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
