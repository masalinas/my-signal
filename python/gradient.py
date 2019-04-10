import sys, json
import numpy as np

y = sys.argv[1]
y = json.loads(y)

y_der = np.gradient(y)

print(json.dumps(y_der.tolist()))