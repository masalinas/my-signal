import sys, json
import numpy as np
import scipy.integrate as integrate

x = sys.argv[1]
y = sys.argv[2]
x = json.loads(x)
y = json.loads(y)

y_int = integrate.cumtrapz(y, x, initial=0)

print(json.dumps(y_int.tolist()))