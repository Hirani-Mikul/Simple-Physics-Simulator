const buttons = Array.from(document.getElementsByTagName('button'));
const sliders = Array.from(document.getElementsByTagName('input'));

const hud_wind = document.getElementById('hud-wind');
const hud_friction = document.getElementById('hud-friction');
const hud_gravity = document.getElementById('hud-gravity');
const hud_drag = document.getElementById('hud-drag');
const hud_size = document.getElementById('hud-size');

let movers = [];
let attractor = new Attractor(width/ 2, height/ 2, 10, 1);

let gravity, wind, frictionVal, dragforceVal;
let moverSize;

let windStatus = false, gravityStatus = false, frictionStatus = false, dragStatus = false, waterStatus = false, attractorStatus = false;

let liquid;

function Start()
{
    moverSize = 5;
    frictionVal = 0.01;
    dragforceVal = 0.01;
    addMovers(200, 200);
    liquid = new Liquid(0, height / 2, width, height / 2, dragforceVal);
    gravity = new Vector(0, 1);
    wind = new Vector(1, 0);

    hud_gravity.innerHTML = gravity.y;
    hud_drag.innerHTML = dragforceVal;
    hud_size.innerHTML = moverSize;
    hud_wind.innerHTML = wind.x;
    hud_friction.innerHTML = frictionVal;
}

Start();

function draw() {

    ctx.clearRect(0, 0, width, height);

    if (waterStatus)
    {
        liquid.display();
    }

    for (let i = 0; i < movers.length; i++)
    {

        let attractForce = attractor.attract(movers[i]);
        if (attractorStatus) {
        movers[i].applyForce(attractForce);
        attractor.display();
        }
        if (windStatus) movers[i].applyForce(wind);
        if (gravityStatus) movers[i].applyForce(gravity);
        if (frictionStatus)
        {
            let friction = getFriction(movers[i]);
            movers[i].applyForce(friction);
        }
        if (dragStatus && waterStatus) {
            if (liquid.contains(movers[i]))
            {
                    let dragforce = liquid.calculateDragForce(movers[i]);
                    movers[i].applyForce(dragforce);
                }
            }
        

        
        movers[i].update();
        
        if (!attractorStatus)
            movers[i].checkWalls();

        movers[i].display();


    }

    requestAnimationFrame(draw);
  }
  draw();

  buttons.forEach((btn) => {
      btn.addEventListener('click', (e) =>
      {
          e.target.classList.toggle('active');
          const type = e.target.dataset['force'];

          switch(type)
          {
            case 'wind':
                windStatus = !windStatus;
            break;
            case 'friction':
                frictionStatus = !frictionStatus;
            break;
            case 'gravity':
                gravityStatus = !gravityStatus;
            break;
            case 'drag':
                dragStatus = !dragStatus;
            break;
            case 'water':
                waterStatus = !waterStatus;
            break;
            case 'attractor':
                attractorStatus = !attractorStatus;
            break;
            case 'clear':
                deactivateForces();
            break;
            case 'reset':
                reset();
            break;
            default:
            break;
                  
          }
      })
  })

  function addMovers(x, y)
  {
      let col = { r:  random(0, 255), g: random(0, 255), b: random(0, 255)};
      movers.push(new Mover(x, y, moverSize, col ));
  }
  function reset()
  {
      movers = [];
      deactivateForces();
      Start();
  }
  function deactivateForces()
  {
      buttons.forEach((btn) => {
          btn.classList.remove('active');
      })
    windStatus = false;
    gravityStatus = false;
    frictionStatus = false;
    dragStatus = false;
    waterStatus = false;
    attractorStatus = false;
  }
  function getFriction(m)
  {
      let normalForce = 1;
      let frictionMag = frictionVal * normalForce;
      let friction = m.vel.clone();
      friction.normalize();
      friction.mult(-1);
      friction.mult(frictionMag);
      return friction;
  }

  sliders.forEach((slider) => {
      slider.addEventListener('change', (e) => {
          const value = e.target.value;
          const type = e.target.dataset['force'];

          switch(type)
          {
              case 'size':
                  moverSize = value;
                  hud_size.innerHTML = value;
                  break;
            case 'wind':
                wind.set(value, 0);
                hud_wind.innerHTML = value;
            break;
            case 'friction':
                frictionVal = value;
                hud_friction.innerHTML = value;
            break;
            case 'gravity':
                gravity.set(0, value);
                hud_gravity.innerHTML = value;
            break;
            case 'drag':
                dragforceVal = value;
                hud_drag.innerHTML = value;
            break;
            default:
                break;
                  
          }
      })
  })