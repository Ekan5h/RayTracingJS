
# RayTracingJS
Implementation of recursive ray tracing algorithm using p5.js library available at [Ekan5h.github.io/RayTracingJS](https://Ekan5h.github.io/RayTracingJS)
## Sample Outputs:
<pre align="center">
<img src = "Sample%20Images/sample1.png" height = 225 width = 300 >   <img src = "Sample%20Images/sample2.png" height = 225 width = 300 >
</pre>
## To create custom scenes:
* Change the eye position by changing the variable **eye**
* Change the window position by changing the variable **screen** which contains the four corners of the window.
* Lights can be positioned in the **lig** list while their brightness can be changed by changing **intenstity**
* Objects can be added to the scene in the **objects** list.
#### Currently, only sphere and floor classes are added.
#### To add more shapes:
* Create a class with data members: **color**, **e** (Emmisivity) and **r** (Reflectance) such that *[e + r = 1]*
* A shape should have the member functions:
  * **intersect(start, dir)**: Return true if a ray starting at *start* in direction *dir* intersects the shape else return false.
  * **getPoint(start, dir)**: Return the point of intersection of the ray starting at *start* in direction *dir*
