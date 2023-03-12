#!/bin/bash

# reads current bootnode URL

CONTAINER=$1
ENODE_LINE=$(docker logs ${CONTAINER} 2>&1 | grep enode | head -n 1)
# replaces localhost by container IP
#MYIP=$(docker exec $CONTAINER ifconfig eth0 | awk '/inet addr/{print substr($2,6)}')
ENODE_LINE_DISCPORT=$(docker logs ${CONTAINER} 2>&1 | grep enode | head -n 1 | awk -F ":" '{print $7}')
#echo $ENODE_LINE_DISCPORT
MYIP='127.0.0.1:0?discport='$ENODE_LINE_DISCPORT
#MYIP='127.0.0.1:'$ENODE_LINE_DISCPORT
#NODE_LINE=$(echo $ENODE_LINE | sed "s/127\.0\.0\.1/$MYIP/g" | sed "s/\[\:\:\]/$MYIP/g")
ENODE_LINE=$(echo $ENODE_LINE | sed "s/\[\:\:\]/$MYIP/g" | awk -F " " '{print $1$2$3$$4$5}' | sed "s/\:[0-9]*up//g")
#echo $ENODE_LINE
echo "enode:${ENODE_LINE#*enode:}"