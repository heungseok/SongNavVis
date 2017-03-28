import sys
import json

# print "\n".join(sys.argv)
test = {
'songs': ['heungseok', 'saebyul', 'jongpil', 'park', 'leonard'],
'tags': ['happy', 'sad', 'normal']

}


# dump the result(dictionary) as json
print json.dumps(test)