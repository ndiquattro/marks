from flask import Blueprint
from ..models.gbookdb import Students

# Register blueprint
dbfunctions = Blueprint('dbfunctions', __name__, url_prefix="/dbfunctions")


@dbfunctions.route('/_uniquecheck/<int:yearid>', methods=['POST', 'GET'])
def ucheck(yearid):
    # Get students
    sinfo = Students.get_byyear(yearid)

    # Make a list of first names
    fnames = [x.first_name for x in sinfo]

    # Loop through students
    for i, student in enumerate(sinfo):
        # Check if this student's first name occurs more than once
        if fnames.count(student.first_name) > 1:
            # Find the indicies of all occurance of the name
            dupi = [i for i, ob in enumerate(sinfo)
                    if ob.first_name == student.first_name]

            # Get the duplicate's last names and the length of longest name
            lnames = [sinfo[i].last_name for i in dupi]
            maxlen = max([len(x) for x in lnames])

            # Loop through each character until they are unique.

            for uin in range(maxlen):
                try:
                    if len(set([x[uin] for x in lnames])) == len(lnames):
                        break
                except IndexError:
                    uin = maxlen
                    break

            # Set the unique character index for duplicates
            for dup in dupi:
                Students.set_unique(sinfo[dup].id, uin)

    return "OK"
