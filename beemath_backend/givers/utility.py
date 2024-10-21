import re 


def remove(item):
    pattern = '[0-9]'
    a = [re.sub(pattern, '', i) for i in item]
    b=[i.strip() for i in a]
    c=[i.split('_') for i in b]
    desc=[]
    variant=[]
    for i in c:
        desc.append(i[0])
        variant.append(i[1])
    return zip(desc,variant)